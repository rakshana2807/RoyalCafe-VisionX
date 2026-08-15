const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.trim().split('=');
  if (k && v) env[k] = v;
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

const WS_UUID = "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a";

async function createProfile(id, email, name) {
  await supabase.from("profiles").upsert({
    id,
    email,
    full_name: name,
    role: "customer"
  });
}

async function createBooking(userId, name) {
  const payload = {
    p_user_id: userId,
    p_customer_name: name,
    p_space_id: WS_UUID,
    p_booking_date: "2026-08-20",
    p_start_time: "10:00:00",
    p_end_time: "13:00:00",
    p_duration_hours: 3,
    p_number_of_people: 1,
    p_total_amount: 300,
    p_status: "confirmed",
    p_payment_status: "paid",
    p_special_request: "Concurrency Test"
  };

  const { data, error } = await supabase.rpc("book_space_safe", payload);
  return { name, data, error };
}

async function runTest() {
  console.log("=== CONCURRENCY TEST ===");
  
  const id1 = "11111111-2222-3333-4444-555555555555";
  const id2 = "22222222-3333-4444-5555-666666666666";

  // Create test profiles
  await createProfile(id1, "alice.test@example.com", "Alice");
  await createProfile(id2, "bob.test@example.com", "Bob");

  // Cleanup
  await supabase.from("bookings").delete().eq("booking_date", "2026-08-20").eq("space_id", WS_UUID);
  
  const p1 = createBooking(id1, "Alice");
  const p2 = createBooking(id2, "Bob");

  const results = await Promise.all([p1, p2]);
  
  let successes = 0;
  let failures = 0;

  for (const r of results) {
    if (r.data && r.data.success) {
      successes++;
      console.log(`[SUCCESS] ${r.name} booked the space! ID: ${r.data.booking_id}`);
    } else {
      failures++;
      console.log(`[FAILED]  ${r.name} failed to book:`, r.data?.error || r.error?.message);
    }
  }
  
  // Cleanup again
  await supabase.from("bookings").delete().eq("booking_date", "2026-08-20").eq("space_id", WS_UUID);
  await supabase.from("profiles").delete().in("id", [id1, id2]);

  if (successes === 1 && failures === 1) {
    console.log("-> TEST PASSED: Exactly 1 booking succeeded and 1 was rejected.");
  } else {
    console.error(`-> TEST FAILED: Successes=${successes}, Failures=${failures}`);
  }
}

runTest();
