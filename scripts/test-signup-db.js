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
  console.log("=== TEST CREATING NEW USER IN AUTH TO TRIGGER PROFILES ROW ===");
  const testEmail = `priya.test.${Date.now()}@gmail.com`;
  const testPassword = "Password123!";

  const { data: authUser, error: authErr } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  const uid = authUser?.user?.id;
  console.log("Created auth user ID:", uid, "| Error:", authErr);

  if (uid) {
    const { data: insertedProf, error: profErr } = await supabase.from('profiles').insert({
      id: uid,
      full_name: "Priya S",
      email: testEmail,
      role: "customer",
      updated_at: new Date().toISOString()
    }).select().single();

    console.log("Inserted profile data:", insertedProf, "| Error:", profErr);
  }

  // Now check profiles table
  const { data: profs } = await supabase.from('profiles').select('*');
  console.log("All profiles count in DB now:", profs?.length);
  console.log("Profiles list:", profs);
}

run();
