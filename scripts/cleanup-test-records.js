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

async function run() {
  console.log("==================================================");
  console.log("IDENTIFYING TEST BOOKING RECORDS FOR CLEANUP");
  console.log("==================================================");

  // 1. Fetch test profiles
  const testEmails = [
    "test.availability@example.com",
    "usera@example.com",
    "userb@example.com",
    "user1@example.com",
    "user2@example.com",
  ];

  const testDates = [
    "2026-10-10",
    "2026-09-01",
    "2026-09-02",
    "2026-09-03",
    "2026-09-04",
    "2026-09-15",
    "2026-09-16",
    "2026-09-17",
    "2026-09-20",
    "2026-09-21",
    "2026-09-22"
  ];

  // Fetch test bookings by test dates or test emails
  const { data: allBookings, error: bErr } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_date,
      start_time,
      status,
      user_id,
      profiles (
        id,
        full_name,
        email
      )
    `);

  if (bErr) {
    console.error("Error fetching bookings:", bErr);
    return;
  }

  const testBookingsToDelete = allBookings.filter(b => {
    const prof = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
    const email = prof?.email?.toLowerCase() || "";
    const name = prof?.full_name?.toLowerCase() || "";
    const isTestEmail = testEmails.includes(email) || email.includes("test") || email.includes("example.com");
    const isTestDate = testDates.includes(b.booking_date);
    return isTestEmail || isTestDate;
  });

  console.log(`Found ${testBookingsToDelete.length} test booking records to delete:\n`);
  testBookingsToDelete.forEach((b, idx) => {
    const prof = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
    console.log(`[${idx + 1}] ID: ${b.id} | Date: ${b.booking_date} | Time: ${b.start_time} | Status: ${b.status} | Email: ${prof?.email} | Name: ${prof?.full_name}`);
  });

  if (testBookingsToDelete.length === 0) {
    console.log("No test booking records found to delete.");
    return;
  }

  console.log("\nDeleting test booking records...");
  const deleteIds = testBookingsToDelete.map(b => b.id);

  const { data: deleted, error: delErr } = await supabase
    .from("bookings")
    .delete()
    .in("id", deleteIds)
    .select("id");

  if (delErr) {
    console.error("Error deleting test bookings:", delErr);
    return;
  }

  console.log(`Successfully deleted ${deleted?.length || deleteIds.length} test booking records.`);

  // Also clean up test profile rows created solely for test execution
  const testProfIds = testBookingsToDelete
    .map(b => {
      const prof = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
      return prof?.email?.includes("example.com") || prof?.email?.includes("test") ? prof.id : null;
    })
    .filter(Boolean);

  if (testProfIds.length > 0) {
    const { data: deletedProfs } = await supabase.from("profiles").delete().in("id", testProfIds).select("id");
    console.log(`Cleaned up ${deletedProfs?.length || 0} test profile records.`);
  }

  console.log("==================================================");
  console.log("CLEANUP COMPLETED!");
  console.log("==================================================");
}

run();
