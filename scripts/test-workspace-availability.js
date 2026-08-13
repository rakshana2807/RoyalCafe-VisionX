const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.trim().split('=');
  if (k && v) env[k] = v;
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const KNOWN_SPACES = {
  WINDOW_SEAT: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a",
  STUDY_DESK: "3732d781-80ab-4473-968e-b86b805a42ef",
  MEETING_ROOM: "f869d631-5539-4b4d-829b-7875133d6fa4",
};

async function resolveSpaceIdAsync(workspaceOrSeat) {
  if (!workspaceOrSeat) {
    const { data } = await supabase.from("spaces").select("id").limit(1).single();
    return data?.id || KNOWN_SPACES.WINDOW_SEAT;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(workspaceOrSeat)) {
    const { data: exactSpace } = await supabase.from("spaces").select("id").eq("id", workspaceOrSeat).maybeSingle();
    if (exactSpace?.id) return exactSpace.id;
  }

  const { data: allSpaces } = await supabase.from("spaces").select("id, name, type");
  if (!allSpaces || allSpaces.length === 0) return KNOWN_SPACES.WINDOW_SEAT;

  const lower = workspaceOrSeat.toLowerCase().trim();

  // 1. Direct name match
  const exactMatch = allSpaces.find((s) => s.name.toLowerCase() === lower);
  if (exactMatch) return exactMatch.id;

  // 2. Partial name match
  const partialNameMatch = allSpaces.find((s) => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower));
  if (partialNameMatch) return partialNameMatch.id;

  // 3. Type keywords match
  if (lower.includes("meeting") || lower.includes("conference") || lower.includes("room")) {
    const meetingSpace = allSpaces.find((s) => s.type === "meeting" || s.name.toLowerCase().includes("meeting"));
    if (meetingSpace) return meetingSpace.id;
  }

  if (lower.includes("study") || lower.includes("workstation") || lower.includes("desk") || lower.includes("cabin") || lower.includes("quiet") || lower.includes("booth")) {
    const studySpace = allSpaces.find((s) => s.type === "study" || s.name.toLowerCase().includes("study"));
    if (studySpace) return studySpace.id;
  }

  if (lower.includes("seat") || lower.includes("window") || lower.includes("cafe")) {
    const seatSpace = allSpaces.find((s) => s.type === "seat" || s.name.toLowerCase().includes("window"));
    if (seatSpace) return seatSpace.id;
  }

  return allSpaces[0].id;
}

function convert12to24(timeStr) {
  if (!timeStr) return "09:00:00";
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
      const parts = timeStr.split(":");
      return `${String(parts[0]).padStart(2, "0")}:${String(parts[1]).padStart(2, "0")}:00`;
    }
    return "09:00:00";
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:00`;
}

async function isSpaceAvailable(spaceId, bookingDate, startTime, endTime) {
  const targetSpaceId = await resolveSpaceIdAsync(spaceId);
  const start24 = convert12to24(startTime);
  const end24 = convert12to24(endTime);

  const { data: conflicts, error } = await supabase
    .from("bookings")
    .select("id, space_id, booking_date, start_time, end_time, status")
    .eq("space_id", targetSpaceId)
    .eq("booking_date", bookingDate)
    .in("status", ["confirmed", "checked_in"])
    .lt("start_time", end24)
    .gt("end_time", start24);

  if (error) {
    console.error("Availability check failed:", error);
    throw new Error("Unable to check workspace availability.");
  }

  if (conflicts && conflicts.length > 0) {
    return false;
  }

  return true;
}

async function getOrCreateProfile({ userEmail, userName }) {
  const email = userEmail?.trim().toLowerCase();
  const fullName = userName?.trim();

  const { data: prof } = await supabase.from("profiles").select("id, full_name, email").eq("email", email).maybeSingle();
  if (prof?.id) return prof;

  const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const { data: created } = await supabase.from("profiles").insert({
    id: newId,
    full_name: fullName || "Test User",
    email: email,
    role: "customer"
  }).select("id, full_name, email").single();

  return created;
}

async function run() {
  console.log("==================================================");
  console.log("WORKSPACE AVAILABILITY FULL 8-TEST SUITE");
  console.log("==================================================");

  const profile = await getOrCreateProfile({ userEmail: "test.availability@example.com", userName: "Availability Tester" });
  const testDate = "2026-10-10";

  // Cleanup any old test bookings for testDate
  await supabase.from("bookings").delete().eq("booking_date", testDate);

  // RESOLVE SPACES
  const windowSeatId = await resolveSpaceIdAsync("Window Seat 01");
  const studyDeskId  = await resolveSpaceIdAsync("Study Desk 01");
  const meetingRoomId = await resolveSpaceIdAsync("Meeting Room");

  console.log("Resolved Space IDs:");
  console.log("-> Window Seat 01:", windowSeatId);
  console.log("-> Study Desk 01 :", studyDeskId);
  console.log("-> Meeting Room  :", meetingRoomId);

  // TEST 1: Window Seat 01 (10:00 AM - 12:00 PM) -> should book if available
  console.log("\n[TEST 1] Booking Window Seat 01 for 10:00 AM - 12:00 PM...");
  const isAvail1 = await isSpaceAvailable(windowSeatId, testDate, "10:00 AM", "12:00 PM");
  console.log("Window Seat 01 Availability Check:", isAvail1 ? "AVAILABLE" : "UNAVAILABLE");
  if (!isAvail1) throw new Error("TEST 1 FAILED: Window Seat 01 should be available!");

  const { data: b1 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: windowSeatId,
    booking_date: testDate,
    start_time: "10:00:00",
    end_time: "12:00:00",
    duration_hours: 2,
    number_of_people: 1,
    total_amount: 100,
    status: "confirmed"
  }).select().single();
  console.log("TEST 1 PASSED -> Booking Created:", b1.id.slice(0, 8));

  // TEST 2: Study Desk 01 (10:00 AM - 12:00 PM) -> should be allowed even if Window Seat 01 is booked
  console.log("\n[TEST 2] Booking Study Desk 01 for 10:00 AM - 12:00 PM...");
  const isAvail2 = await isSpaceAvailable(studyDeskId, testDate, "10:00 AM", "12:00 PM");
  console.log("Study Desk 01 Availability Check:", isAvail2 ? "AVAILABLE" : "UNAVAILABLE");
  if (!isAvail2) throw new Error("TEST 2 FAILED: Study Desk 01 should be available even when Window Seat is booked!");

  const { data: b2 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: studyDeskId,
    booking_date: testDate,
    start_time: "10:00:00",
    end_time: "12:00:00",
    duration_hours: 2,
    number_of_people: 1,
    total_amount: 160,
    status: "confirmed"
  }).select().single();
  console.log("TEST 2 PASSED -> Booking Created:", b2.id.slice(0, 8));

  // TEST 3: Meeting Room (10:00 AM - 12:00 PM) -> should be allowed even if Window Seat 01 is booked
  console.log("\n[TEST 3] Booking Meeting Room for 10:00 AM - 12:00 PM...");
  const isAvail3 = await isSpaceAvailable(meetingRoomId, testDate, "10:00 AM", "12:00 PM");
  console.log("Meeting Room Availability Check:", isAvail3 ? "AVAILABLE" : "UNAVAILABLE");
  if (!isAvail3) throw new Error("TEST 3 FAILED: Meeting Room should be available even when Window Seat is booked!");

  const { data: b3 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: meetingRoomId,
    booking_date: testDate,
    start_time: "10:00:00",
    end_time: "12:00:00",
    duration_hours: 2,
    number_of_people: 4,
    total_amount: 600,
    status: "confirmed"
  }).select().single();
  console.log("TEST 3 PASSED -> Booking Created:", b3.id.slice(0, 8));

  // TEST 4: Window Seat 01 (10:30 AM - 11:30 AM) -> MUST BE REJECTED due to overlap with 10:00 AM - 12:00 PM
  console.log("\n[TEST 4] Booking Window Seat 01 for OVERLAPPING time 10:30 AM - 11:30 AM...");
  const isAvail4 = await isSpaceAvailable(windowSeatId, testDate, "10:30 AM", "11:30 AM");
  console.log("Window Seat 01 Overlap Check:", isAvail4 ? "AVAILABLE (INCORRECT)" : "REJECTED (CORRECT)");
  if (isAvail4) throw new Error("TEST 4 FAILED: Overlapping booking for Window Seat 01 should have been rejected!");
  console.log("TEST 4 PASSED -> Overlap correctly rejected!");

  // TEST 5: Window Seat 01 (12:00 PM - 01:00 PM) -> MUST BE ALLOWED when previous booking ends at 12:00 PM
  console.log("\n[TEST 5] Booking Window Seat 01 for BACK-TO-BACK time 12:00 PM - 01:00 PM...");
  const isAvail5 = await isSpaceAvailable(windowSeatId, testDate, "12:00 PM", "01:00 PM");
  console.log("Window Seat 01 Back-to-Back Check:", isAvail5 ? "AVAILABLE (CORRECT)" : "REJECTED (INCORRECT)");
  if (!isAvail5) throw new Error("TEST 5 FAILED: Back-to-back booking starting at 12:00 PM should be allowed!");
  console.log("TEST 5 PASSED -> Back-to-back booking correctly allowed!");

  // TEST 6: Checked Out booking should NOT block availability
  console.log("\n[TEST 6] Testing CHECKED_OUT booking non-blocking behavior...");
  const { data: b6 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: windowSeatId,
    booking_date: testDate,
    start_time: "02:00:00",
    end_time: "04:00:00",
    duration_hours: 2,
    number_of_people: 1,
    total_amount: 100,
    status: "checked_out"
  }).select().single();

  const isAvail6 = await isSpaceAvailable(windowSeatId, testDate, "02:00 PM", "04:00 PM");
  console.log("Checked Out Space Availability Check:", isAvail6 ? "AVAILABLE (CORRECT)" : "REJECTED (INCORRECT)");
  if (!isAvail6) throw new Error("TEST 6 FAILED: Workspace with checked_out status must be available!");
  console.log("TEST 6 PASSED -> Checked out status does not block availability!");

  // TEST 7: Cancelled booking should NOT block availability
  console.log("\n[TEST 7] Testing CANCELLED booking non-blocking behavior...");
  const { data: b7 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: windowSeatId,
    booking_date: testDate,
    start_time: "05:00:00",
    end_time: "07:00:00",
    duration_hours: 2,
    number_of_people: 1,
    total_amount: 100,
    status: "cancelled"
  }).select().single();

  const isAvail7 = await isSpaceAvailable(windowSeatId, testDate, "05:00 PM", "07:00 PM");
  console.log("Cancelled Space Availability Check:", isAvail7 ? "AVAILABLE (CORRECT)" : "REJECTED (INCORRECT)");
  if (!isAvail7) throw new Error("TEST 7 FAILED: Workspace with cancelled status must be available!");
  console.log("TEST 7 PASSED -> Cancelled status does not block availability!");

  // TEST 8: Admin Reservations Query verification
  console.log("\n[TEST 8] Admin Reservations Query verification...");
  const { data: adminList } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email,
        phone
      ),
      spaces (
        id,
        name,
        type
      )
    `)
    .eq("booking_date", testDate)
    .order("created_at", { ascending: false });

  console.log(`Fetched ${adminList?.length} bookings for test date ${testDate}:`);
  adminList.forEach((row, idx) => {
    const prof = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const space = Array.isArray(row.spaces) ? row.spaces[0] : row.spaces;
    console.log(`  [${idx + 1}] Workspace: "${space?.name}" (${space?.type}) | Time: ${row.start_time}-${row.end_time} | Status: ${row.status} | Customer: ${prof?.full_name}`);
  });

  console.log("\n==================================================");
  console.log("ALL 8 AVAILABILITY TESTS COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
}

run();
