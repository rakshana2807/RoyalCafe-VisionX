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

// Test if we can use postgres REST or sql endpoint
async function run() {
  console.log("=== TESTING DATABASE DIRECT INSERT ===");
  // Check if profiles insert with a fresh UUID works or gives 23503
  const testId = "11111111-2222-3333-4444-555555555555";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.from('profiles').insert({
    id: testId,
    full_name: "Priya S",
    email: "priya_unique@example.com",
    role: "customer"
  }).select();

  console.log("Insert result:", data, "| Error:", error);
}

run();
