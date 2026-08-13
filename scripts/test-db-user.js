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
  console.log("=== TEST INSERTING PROFILE ===");
  const testId = "012b7599-4199-4e3f-a4f3-2a0418d9de04"; // existing user ID in auth.users

  // 1. Can we insert into profiles if id matches an existing auth user?
  // Let's test inserting a profile with an email and id
  const { data: prof1, error: e1 } = await supabase.from('profiles').insert({
    id: "012b7599-4199-4e3f-a4f3-2a0418d9de04",
    full_name: "Test Name",
    email: "test@example.com"
  }).select();

  console.log("Insert with existing ID result:", prof1, "| Error:", e1);
}

run();
