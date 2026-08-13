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
  console.log("=== TEST INSERTING INTO PROFILES WITHOUT ID ===");
  const testEmail = `priya_${Date.now()}@gmail.com`;

  const { data, error } = await supabase.from('profiles').insert({
    full_name: "Priya S",
    email: testEmail,
    role: "customer"
  }).select().single();

  console.log("Insert result:", data, "| Error:", error);
}

run();
