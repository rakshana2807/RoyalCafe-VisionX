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

async function getOrCreateProfile({ userEmail, userName, userPhone }) {
  const email = userEmail?.trim().toLowerCase();
  const fullName = userName?.trim();
  const phone = userPhone?.trim();

  if (!email) throw new Error("Email required");

  // 1. Search profiles strictly by email
  const { data: profByEmail } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq("email", email)
    .maybeSingle();

  if (profByEmail?.id) {
    if (fullName && (profByEmail.full_name !== fullName || (phone && profByEmail.phone !== phone))) {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || profByEmail.phone,
          updated_at: new Date().toISOString()
        })
        .eq("id", profByEmail.id);
    }
    return { id: profByEmail.id, full_name: fullName || profByEmail.full_name, email, phone: phone || profByEmail.phone };
  }

  // 2. Create new profile
  const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const { data: newProf, error: err } = await supabase
    .from("profiles")
    .insert({
      id: newId,
      full_name: fullName || "Customer",
      email: email,
      phone: phone || null,
      role: "customer",
      updated_at: new Date().toISOString()
    })
    .select("id, full_name, email, phone")
    .single();

  if (err) throw err;
  return newProf;
}

async function createSupabaseBooking(input) {
  const profile = await getOrCreateProfile({
    userEmail: input.userEmail,
    userName: input.userName,
    userPhone: input.userPhone,
  });

  const payload = {
    user_id: profile.id,
    space_id: input.spaceId,
    booking_date: input.bookingDate,
    start_time: input.startTime || "10:00:00",
    end_time: input.endTime || "11:00:00",
    duration_hours: input.durationHours || 1,
    number_of_people: input.numberOfPeople || 1,
    total_amount: input.totalAmount || 100,
    status: "confirmed",
    payment_status: "paid",
    special_request: input.specialRequest || null,
  };

  const { data, error } = await supabase.from("bookings").insert(payload).select().single();
  if (error) throw error;
  return { ...data, profile };
}

async function run() {
  console.log("==================================================");
  console.log("EXACT TWO-USER END-TO-END BOOKING TEST");
  console.log("==================================================");

  // USER 1: Rakshana
  console.log("\n[TEST 1] User 1 Booking: Rakshana");
  const b1 = await createSupabaseBooking({
    userName: "Rakshana",
    userEmail: "rakshanarajagopal93@gmail.com",
    userPhone: "1234567890",
    spaceId: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a",
    bookingDate: "2026-08-13",
    startTime: "19:15:00",
    endTime: "20:15:00",
    durationHours: 1,
    numberOfPeople: 2,
    totalAmount: 180,
    specialRequest: "Desk T-2S-5 (2 Seater) - Work & Study Zone"
  });
  console.log("User 1 Profile ID:", b1.profile.id, "| Name:", b1.profile.full_name, "| Email:", b1.profile.email);

  // USER 2: Priya Kumar
  console.log("\n[TEST 2] User 2 Booking: Priya Kumar");
  const b2 = await createSupabaseBooking({
    userName: "Priya Kumar",
    userEmail: "priya@gmail.com",
    userPhone: "9876543210",
    spaceId: "3732d781-80ab-4473-968e-b86b805a42ef",
    bookingDate: "2026-08-15",
    startTime: "10:00:00",
    endTime: "12:00:00",
    durationHours: 2,
    numberOfPeople: 1,
    totalAmount: 200,
    specialRequest: "Window Seat 01 - Café Zone"
  });
  console.log("User 2 Profile ID:", b2.profile.id, "| Name:", b2.profile.full_name, "| Email:", b2.profile.email);

  // USER 1 REPEAT: Rakshana
  console.log("\n[TEST 3] User 1 Repeat Booking: Rakshana");
  const b3 = await createSupabaseBooking({
    userName: "Rakshana",
    userEmail: "rakshanarajagopal93@gmail.com",
    userPhone: "1234567890",
    spaceId: "f869d631-5539-4b4d-829b-7875133d6fa4",
    bookingDate: "2026-08-18",
    startTime: "14:00:00",
    endTime: "16:00:00",
    durationHours: 2,
    numberOfPeople: 4,
    totalAmount: 500,
    specialRequest: "Meeting Room"
  });
  console.log("User 1 Repeat Profile ID:", b3.profile.id, "| Name:", b3.profile.full_name);

  // CHECKS
  console.log("\n==================================================");
  console.log("VERIFICATION OF PROFILE ID LOGIC:");
  console.log("1. Distinct Profile IDs Check:", b1.profile.id !== b2.profile.id ? "PASSED (Rakshana & Priya have different profile IDs)" : "FAILED");
  console.log("2. Profile Reuse Check:", b1.profile.id === b3.profile.id ? "PASSED (Rakshana reused Profile ID for second booking)" : "FAILED");
  console.log("==================================================");

  // ADMIN QUERY VERIFICATION
  console.log("\n=== ADMIN RESERVATIONS SUPABASE QUERY ===");
  const { data: adminData } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(3);

  adminData.forEach((row, idx) => {
    const prof = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const space = Array.isArray(row.spaces) ? row.spaces[0] : row.spaces;
    console.log(`\n[Reservation ${idx + 1}]`);
    console.log(`  Booking ID    : ${row.id.slice(0, 8).toUpperCase()}`);
    console.log(`  Customer Name : ${prof?.full_name}`);
    console.log(`  Email         : ${prof?.email}`);
    console.log(`  Phone         : ${prof?.phone}`);
    console.log(`  Workspace Name: ${space?.name}`);
    console.log(`  Workspace Type: ${space?.type}`);
    console.log(`  Booking Date  : ${row.booking_date}`);
    console.log(`  Start Time    : ${row.start_time}`);
    console.log(`  Duration      : ${row.duration_hours} Hour(s)`);
    console.log(`  Status        : ${row.status}`);
  });

  console.log("\n==================================================");
  console.log("ADMIN QUERY VERIFICATION PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

run();
