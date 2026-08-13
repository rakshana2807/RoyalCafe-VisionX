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

// Generate distinct UUIDs for physical seats EF-005 and EF-006
const EF005_UUID = "88888888-0000-4000-8000-000000000005";
const EF006_UUID = "88888888-0000-4000-8000-000000000006";

async function isSpaceAvailableByUuid(spaceId, bookingDate, start24, end24) {
  const { data: conflicts, error } = await supabase
    .from("bookings")
    .select("id, space_id, booking_date, start_time, end_time, status")
    .eq("space_id", spaceId)
    .eq("booking_date", bookingDate)
    .in("status", ["confirmed", "checked_in"])
    .lt("start_time", end24)
    .gt("end_time", start24);

  if (error) throw error;
  return !(conflicts && conflicts.length > 0);
}

async function run() {
  console.log("==================================================");
  console.log("TESTING INDIVIDUAL PHYSICAL WORKSPACE IDENTIFIERS");
  console.log("==================================================");

  const profile = await getOrCreateProfile({ userEmail: "unique.workspaces@example.com", userName: "Workspace Tester" });
  const testDate = "2026-11-15";

  // Clean up any old bookings for testDate
  await supabase.from("bookings").delete().eq("booking_date", testDate);

  // Ensure EF-005 and EF-006 exist in spaces table
  await supabase.from("spaces").upsert([
    { id: EF005_UUID, name: "Elder Friendly Seat 05", type: "seat", capacity: 1, price_per_hour: 70, is_available: true },
    { id: EF006_UUID, name: "Elder Friendly Seat 06", type: "seat", capacity: 1, price_per_hour: 70, is_available: true }
  ], { onConflict: "id" });

  console.log("Physical Workspace UUIDs:");
  console.log("-> EF-005 Space ID:", EF005_UUID);
  console.log("-> EF-006 Space ID:", EF006_UUID);

  // TEST 1: EF-005 (07:15 PM - 08:15 PM) -> Booking succeeds
  console.log("\n[TEST 1] Booking EF-005 for 07:15 PM - 08:15 PM...");
  const isAvail1 = await isSpaceAvailableByUuid(EF005_UUID, testDate, "19:15:00", "20:15:00");
  if (!isAvail1) throw new Error("TEST 1 FAILED: EF-005 should be available!");

  const { data: b1 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: EF005_UUID,
    booking_date: testDate,
    start_time: "19:15:00",
    end_time: "20:15:00",
    duration_hours: 1,
    number_of_people: 1,
    total_amount: 100,
    status: "confirmed"
  }).select().single();
  console.log("TEST 1 PASSED -> Booking 1 Created on EF-005:", b1.id.slice(0, 8), "| Space ID:", b1.space_id);

  // TEST 2: EF-006 (07:15 PM - 08:15 PM) -> Booking succeeds for EF-006 even though EF-005 is booked!
  console.log("\n[TEST 2] Booking EF-006 for 07:15 PM - 08:15 PM...");
  const isAvail2 = await isSpaceAvailableByUuid(EF006_UUID, testDate, "19:15:00", "20:15:00");
  if (!isAvail2) throw new Error("TEST 2 FAILED: EF-006 should be available even when EF-005 is booked!");

  const { data: b2 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: EF006_UUID,
    booking_date: testDate,
    start_time: "19:15:00",
    end_time: "20:15:00",
    duration_hours: 1,
    number_of_people: 1,
    total_amount: 100,
    status: "confirmed"
  }).select().single();
  console.log("TEST 2 PASSED -> Booking 2 Created on EF-006:", b2.id.slice(0, 8), "| Space ID:", b2.space_id);

  // TEST 3: EF-005 (07:15 PM - 08:15 PM) again -> Booking is REJECTED
  console.log("\n[TEST 3] Booking EF-005 again for 07:15 PM - 08:15 PM...");
  const isAvail3 = await isSpaceAvailableByUuid(EF005_UUID, testDate, "19:15:00", "20:15:00");
  console.log("EF-005 Availability Check:", isAvail3 ? "AVAILABLE (INCORRECT)" : "REJECTED (CORRECT)");
  if (isAvail3) throw new Error("TEST 3 FAILED: Overlapping booking for EF-005 should be rejected!");
  console.log("TEST 3 PASSED -> Overlapping booking for EF-005 correctly rejected!");

  // TEST 4: EF-005 (08:15 PM - 09:15 PM) -> Booking succeeds
  console.log("\n[TEST 4] Booking EF-005 for 08:15 PM - 09:15 PM (Back to Back)...");
  const isAvail4 = await isSpaceAvailableByUuid(EF005_UUID, testDate, "20:15:00", "21:15:00");
  if (!isAvail4) throw new Error("TEST 4 FAILED: Back-to-back booking for EF-005 should be allowed!");

  const { data: b4 } = await supabase.from("bookings").insert({
    user_id: profile.id,
    space_id: EF005_UUID,
    booking_date: testDate,
    start_time: "20:15:00",
    end_time: "21:15:00",
    duration_hours: 1,
    number_of_people: 1,
    total_amount: 100,
    status: "confirmed"
  }).select().single();
  console.log("TEST 4 PASSED -> Booking 4 Created on EF-005:", b4.id.slice(0, 8), "| Space ID:", b4.space_id);

  // VERIFICATION
  console.log("\n==================================================");
  console.log("DATABASE SPACE ID VERIFICATION:");
  console.log("Booking 1 Space ID (EF-005):", b1.space_id);
  console.log("Booking 2 Space ID (EF-006):", b2.space_id);
  console.log("Space IDs Are Different   :", b1.space_id !== b2.space_id ? "PASSED (EF-005 !== EF-006)" : "FAILED");
  console.log("==================================================");

  // Cleanup test date records
  await supabase.from("bookings").delete().eq("booking_date", testDate);
  await supabase.from("profiles").delete().eq("id", profile.id);
  console.log("Test cleanup completed.");
}

run();
