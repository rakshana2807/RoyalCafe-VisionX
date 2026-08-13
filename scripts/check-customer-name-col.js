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
  console.log("=== CHECKING/ADDING CUSTOMER_NAME COLUMN TO BOOKINGS ===");

  // Test inserting customer_name in bookings table
  const { data: testCol, error } = await supabase
    .from('bookings')
    .select('id, customer_name')
    .limit(1);

  console.log("customer_name column check:", testCol, error);
}

run();
