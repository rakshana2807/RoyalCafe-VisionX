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

const WS_UUID = "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a";
const SD_UUID = "3732d781-80ab-4473-968e-b86b805a42ef";

async function getOrCreateProfile({ userEmail, userName, userPhone }) {
  const email = userEmail?.trim().toLowerCase();
  const fullName = userName?.trim();
  const phone = userPhone?.trim();

  const { data: prof } = await supabase.from("profiles").select("id, full_name, email, phone").eq("email", email).maybeSingle();
  if (prof?.id) {
    if (fullName && (prof.full_name !== fullName || (phone && prof.phone !== phone))) {
      await supabase.from("profiles").update({ full_name: fullName, phone: phone || prof.phone, updated_at: new Date().toISOString() }).eq("id", prof.id);
    }
    return { id: prof.id, full_name: fullName || prof.full_name, email, phone: phone || prof.phone };
  }

  const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const { data: created, error } = await supabase.from("profiles").insert({
    id: newId,
    full_name: fullName || "Test User",
    email: email,
    phone: phone || null,
    role: "customer",
    updated_at: new Date().toISOString()
  }).select("id, full_name, email, phone").single();

  if (error) throw error;
  return created;
}

async function createBooking(input) {
  const profile = await getOrCreateProfile({
    userEmail: input.userEmail,
    userName: input.userName,
    userPhone: input.userPhone,
  });

  const customerName = input.userName?.trim() || profile.full_name || "Customer";

  const payload = {
    user_id: profile.id,
    space_id: input.spaceId,
    booking_date: input.bookingDate,
    start_time: input.startTime,
    end_time: input.endTime,
    duration_hours: input.durationHours || 1,
    number_of_people: input.numberOfPeople || 1,
    total_amount: input.totalAmount || 100,
    status: input.status || "confirmed",
    payment_status: input.paymentStatus || "paid",
    special_request: input.specialRequest || null
  };

  const { data: bData, error: bErr } = await supabase.from("bookings").insert({
    ...payload,
    customer_name: customerName
  }).select("*").single();

  if (bErr) {
    const { data: retryData, error: retryErr } = await supabase.from("bookings").insert(payload).select("*").single();
    if (retryErr) throw retryErr;
    return { ...retryData, profile };
  }

  return { ...bData, profile };
}

async function run() {
  console.log("==================================================");
  console.log("CUSTOMER NAME DIRECT PERSISTENCE VERIFICATION");
  console.log("==================================================");

  const testDate = "2026-12-30";
  await supabase.from("bookings").delete().eq("booking_date", testDate);

  // 1. Customer 1: Rakshana
  console.log("[STEP 1] Creating booking for Customer 1 (Rakshana)...");
  const b1 = await createBooking({
    userName: "Rakshana",
    userEmail: "rakshana@example.com",
    userPhone: "1234567890",
    spaceId: WS_UUID,
    bookingDate: testDate,
    startTime: "10:00:00",
    endTime: "11:00:00",
    durationHours: 1,
    totalAmount: 100
  });
  console.log("-> Booking 1 Created. Customer Name:", b1.customer_name || b1.profile.full_name, "| Space ID:", b1.space_id);

  // 2. Customer 2: Priya Kumar
  console.log("\n[STEP 2] Creating booking for Customer 2 (Priya Kumar)...");
  let b2;
  try {
    b2 = await createBooking({
      userName: "Priya Kumar",
      userEmail: "priya@example.com",
      userPhone: "9876543210",
      spaceId: SD_UUID,
      bookingDate: testDate,
      startTime: "11:00:00",
      endTime: "12:00:00",
      durationHours: 1,
      totalAmount: 80
    });
    console.log("-> Booking 2 Created. Customer Name:", b2.customer_name || b2.profile.full_name, "| Space ID:", b2.space_id);
  } catch (err) {
    console.error("Booking 2 Error:", err);
    throw err;
  }

  // VERIFICATIONS
  console.log("\n==================================================");
  console.log("VERIFICATIONS:");
  console.log("1. Rakshana profile exists :", b1.profile.full_name === "Rakshana");
  console.log("2. Priya Kumar profile exists:", b2.profile.full_name === "Priya Kumar");
  console.log("3. Profile IDs are different :", b1.profile.id !== b2.profile.id);
  console.log("4. Booking 1 customer name   :", b1.customer_name || b1.profile.full_name);
  console.log("5. Booking 2 customer name   :", b2.customer_name || b2.profile.full_name);
  console.log("6. Correct space_id values   :", b1.space_id === WS_UUID && b2.space_id === SD_UUID);
  console.log("==================================================");

  // Query Admin View
  const { data: adminList } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles ( id, full_name, email, phone ),
      spaces ( id, name, type )
    `)
    .eq("booking_date", testDate)
    .order("created_at", { ascending: false });

  console.log(`\nAdmin Query Returned ${adminList?.length} rows:`);
  adminList?.forEach((r, idx) => {
    const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const space = Array.isArray(r.spaces) ? r.spaces[0] : r.spaces;
    const display = r.customer_name || prof?.full_name;
    console.log(`  [Row ${idx + 1}] ID: ${r.id.slice(0, 8)} | User Name: "${display}" | Workspace: "${space?.name}" | Status: ${r.status}`);
  });

  // Cleanup test bookings
  await supabase.from("bookings").delete().eq("booking_date", testDate);
  await supabase.from("profiles").delete().in("id", [b1.profile.id, b2.profile.id]);
  console.log("\nCleanup completed.");
}

run();
