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

async function inspect() {
  console.log("=== 1. FETCH ALL PROFILES ===");
  const { data: profs, error: pErr } = await supabase.from('profiles').select('*');
  console.log("Profiles count:", profs?.length, "| Error:", pErr);
  console.log("Profiles data:", JSON.stringify(profs, null, 2));

  console.log("\n=== 2. FETCH ALL BOOKINGS ===");
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('id, user_id, status, booking_date').limit(5);
  console.log("Bookings sample:", JSON.stringify(bookings, null, 2));

  console.log("\n=== 3. CHECK SPACES ===");
  const { data: spaces } = await supabase.from('spaces').select('id, name');
  console.log("Spaces sample:", JSON.stringify(spaces, null, 2));
}

inspect();
