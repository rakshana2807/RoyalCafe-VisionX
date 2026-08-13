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
  console.log("=== TEST CREATING 2 DISTINCT USERS VIA SUPABASE AUTH SIGNUP ===");

  const ts = Date.now();
  const emailA = `arun_${ts}@gmail.com`;
  const emailB = `priya_${ts}@gmail.com`;

  // User A
  const { data: authA, error: errA } = await supabase.auth.signUp({ email: emailA, password: "Password123!" });
  console.log("User A Auth ID:", authA?.user?.id, "| Error:", errA?.message);

  if (authA?.user?.id) {
    const { data: profA, error: pErrA } = await supabase.from('profiles').insert({
      id: authA.user.id,
      full_name: "Arun Kumar",
      email: emailA,
      role: "customer",
      updated_at: new Date().toISOString()
    }).select().single();
    console.log("User A Profile Inserted:", profA?.id, "| Error:", pErrA?.message);
  }

  // User B
  const { data: authB, error: errB } = await supabase.auth.signUp({ email: emailB, password: "Password123!" });
  console.log("User B Auth ID:", authB?.user?.id, "| Error:", errB?.message);

  if (authB?.user?.id) {
    const { data: profB, error: pErrB } = await supabase.from('profiles').insert({
      id: authB.user.id,
      full_name: "Priya S",
      email: emailB,
      role: "customer",
      updated_at: new Date().toISOString()
    }).select().single();
    console.log("User B Profile Inserted:", profB?.id, "| Error:", pErrB?.message);
  }

  console.log("\n=== ALL PROFILES NOW IN DATABASE ===");
  const { data: allProfs } = await supabase.from('profiles').select('id, full_name, email');
  console.log(JSON.stringify(allProfs, null, 2));
}

run();
