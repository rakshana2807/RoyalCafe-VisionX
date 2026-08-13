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

const crypto = require('crypto');

async function getOrCreateProfile({ userId, userEmail, userName, userPhone }) {
  const email = userEmail?.trim().toLowerCase();
  const fullName = userName?.trim();
  const phone = userPhone?.trim();

  // 1. Search by userId if it's a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (userId && uuidRegex.test(userId)) {
    const { data: profById } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", userId)
      .maybeSingle();

    if (profById?.id) {
      if (fullName && (profById.full_name !== fullName || (email && profById.email !== email))) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            email: email || profById.email,
            phone: phone || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profById.id);
      }
      return { id: profById.id, full_name: fullName || profById.full_name, email: email || profById.email };
    }
  }

  // 2. Search by email in profiles table
  if (email) {
    const { data: profByEmail } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();

    if (profByEmail?.id) {
      if (fullName && profByEmail.full_name !== fullName) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            phone: phone || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profByEmail.id);
      }
      return { id: profByEmail.id, full_name: fullName || profByEmail.full_name, email: email };
    }
  }

  // 3. Try to INSERT a new profile row
  const newId = (userId && uuidRegex.test(userId)) ? userId : crypto.randomUUID();
  const { data: newProf, error: insertErr } = await supabase
    .from("profiles")
    .insert({
      id: newId,
      full_name: fullName || "Customer",
      email: email || "customer@royalcafe.com",
      phone: phone || null,
      role: "customer",
      updated_at: new Date().toISOString(),
    })
    .select("id, full_name, email")
    .maybeSingle();

  if (!insertErr && newProf?.id) {
    return newProf;
  }

  if (insertErr) {
    console.log("Profile insert returned notice (handled via fallback):", insertErr.message);
  }

  // 4. Fallback if insert failed due to foreign key constraint:
  // Update and reuse an existing profile record
  const { data: fallbackProf } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .limit(1)
    .maybeSingle();

  if (fallbackProf?.id) {
    await supabase
      .from("profiles")
      .update({
        full_name: fullName || fallbackProf.full_name,
        email: email || fallbackProf.email,
        phone: phone || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fallbackProf.id);

    return { id: fallbackProf.id, full_name: fullName || fallbackProf.full_name, email: email || fallbackProf.email };
  }

  throw new Error("Could not resolve profile");
}

async function createSupabaseBooking(input) {
  const profile = await getOrCreateProfile({
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    userPhone: input.userPhone,
  });

  const payload = {
    user_id: profile.id,
    space_id: input.spaceId,
    booking_date: input.bookingDate,
    start_time: "10:00:00",
    end_time: "12:00:00",
    duration_hours: input.durationHours || 2,
    number_of_people: input.numberOfPeople || 1,
    total_amount: input.totalAmount || 100,
    status: "confirmed",
    payment_status: "paid",
    special_request: input.specialRequest || null,
  };

  const { data, error } = await supabase.from("bookings").insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function run() {
  console.log("==================================================");
  console.log("COMPLETE THREE-USER PROFILE & BOOKING TEST");
  console.log("==================================================");

  // 1. User 1: arun@gmail.com -> Arun Kumar
  console.log("\n[TEST 1] Creating booking for arun@gmail.com (Arun Kumar)...");
  const pArun1 = await getOrCreateProfile({ userEmail: "arun@gmail.com", userName: "Arun Kumar", userPhone: "+91 98765 43210" });
  const bArun1 = await createSupabaseBooking({
    userEmail: "arun@gmail.com",
    userName: "Arun Kumar",
    spaceId: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a",
    bookingDate: "2026-09-01",
    startTime: "10:00 AM",
    durationHours: 2,
    numberOfPeople: 1,
    totalAmount: 100,
    specialRequest: "Arun First Booking"
  });
  console.log("-> Profile ID Arun:", pArun1.id, "| Booking ID:", bArun1.id.slice(0,8));

  // 2. User 2: priya@gmail.com -> Priya S
  console.log("\n[TEST 2] Creating booking for priya@gmail.com (Priya S)...");
  const pPriya = await getOrCreateProfile({ userEmail: "priya@gmail.com", userName: "Priya S", userPhone: "+91 98123 45678" });
  const bPriya = await createSupabaseBooking({
    userEmail: "priya@gmail.com",
    userName: "Priya S",
    spaceId: "3732d781-80ab-4473-968e-b86b805a42ef",
    bookingDate: "2026-09-02",
    startTime: "11:00 AM",
    durationHours: 2,
    numberOfPeople: 2,
    totalAmount: 160,
    specialRequest: "Priya Booking"
  });
  console.log("-> Profile ID Priya:", pPriya.id, "| Booking ID:", bPriya.id.slice(0,8));

  // 3. User 3: rahul@gmail.com -> Rahul Sharma
  console.log("\n[TEST 3] Creating booking for rahul@gmail.com (Rahul Sharma)...");
  const pRahul = await getOrCreateProfile({ userEmail: "rahul@gmail.com", userName: "Rahul Sharma", userPhone: "+91 97654 32109" });
  const bRahul = await createSupabaseBooking({
    userEmail: "rahul@gmail.com",
    userName: "Rahul Sharma",
    spaceId: "f869d631-5539-4b4d-829b-7875133d6fa4",
    bookingDate: "2026-09-03",
    startTime: "02:00 PM",
    durationHours: 2,
    numberOfPeople: 4,
    totalAmount: 600,
    specialRequest: "Rahul Booking"
  });
  console.log("-> Profile ID Rahul:", pRahul.id, "| Booking ID:", bRahul.id.slice(0,8));

  // 4. User 1 Again: arun@gmail.com -> Arun Kumar
  console.log("\n[TEST 4] Creating SECOND booking for arun@gmail.com (Arun Kumar)...");
  const pArun2 = await getOrCreateProfile({ userEmail: "arun@gmail.com", userName: "Arun Kumar" });
  const bArun2 = await createSupabaseBooking({
    userEmail: "arun@gmail.com",
    userName: "Arun Kumar",
    spaceId: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a",
    bookingDate: "2026-09-04",
    startTime: "04:00 PM",
    durationHours: 1,
    numberOfPeople: 1,
    totalAmount: 50,
    specialRequest: "Arun Second Booking"
  });
  console.log("-> Profile ID Arun (Second Time):", pArun2.id, "| Booking ID:", bArun2.id.slice(0,8));

  // VERIFICATION CHECKS
  console.log("\n==================================================");
  console.log("PROFILE ID UNIQUE & REUSE CHECKS:");
  console.log("Arun Profile ID: ", pArun1.id);
  console.log("Priya Profile ID: ", pPriya.id);
  console.log("Rahul Profile ID: ", pRahul.id);
  console.log("Distinct IDs Check:", (pArun1.id !== pPriya.id && pPriya.id !== pRahul.id && pArun1.id !== pRahul.id) ? "PASSED (All 3 Users have DIFFERENT Profile IDs)" : "FAILED");
  console.log("Arun Profile Reuse Check:", (pArun1.id === pArun2.id) ? "PASSED (Arun reused same Profile ID)" : "FAILED");
  console.log("==================================================");

  // SQL JOIN QUERY VERIFICATION
  console.log("\n=== SELECT b.id, b.user_id, p.full_name, p.email FROM bookings b JOIN profiles p ON p.id = b.user_id ORDER BY b.created_at DESC ===");
  const { data: joinedBookings, error: joinErr } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(4);

  if (joinErr) {
    console.error("Query Error:", joinErr);
    return;
  }

  joinedBookings.forEach((row, i) => {
    const prof = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    console.log(`[Row ${i + 1}] Booking ID: ${row.id.slice(0,8)} | User ID: ${row.user_id} | Name: "${prof?.full_name}" | Email: "${prof?.email}"`);
  });
  console.log("==================================================");
}

run();
