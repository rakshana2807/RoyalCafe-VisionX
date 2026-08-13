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
  console.log("=== INSPECTING DB PROFILES & USERS ===");

  // 1. Try querying profiles
  const { data: profs, error: pErr } = await supabase.from("profiles").select("*");
  console.log("Profiles:", profs, "| Error:", pErr);

  // 2. Try inserting a profile with an existing or new ID
  // Let's test if we can insert into profiles using an auth admin or if profiles requires auth.users
  // Let's check if auth.users table is accessible or if we can see auth users
  const { data: authUserTest, error: aErr } = await supabase.rpc('get_service_status');
  console.log("RPC Test:", authUserTest, aErr);
}

run();
