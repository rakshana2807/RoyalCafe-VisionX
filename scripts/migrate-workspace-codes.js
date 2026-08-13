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
  console.log("=== MIGRATING SPACES TABLE WITH WORKSPACE_CODE ===");

  // 1. Existing spaces update
  const initialSpaces = [
    { id: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a", workspace_code: "WS-001", name: "Window Seat 01", type: "seat", capacity: 1, price_per_hour: 100, is_available: true },
    { id: "3732d781-80ab-4473-968e-b86b805a42ef", workspace_code: "SD-001", name: "Study Desk 01", type: "study", capacity: 1, price_per_hour: 80, is_available: true },
    { id: "f869d631-5539-4b4d-829b-7875133d6fa4", workspace_code: "MR-001", name: "Meeting Room 01", type: "meeting", capacity: 6, price_per_hour: 300, is_available: true },
    
    // Additional seats
    { id: "98765432-0000-4000-8000-000000000002", workspace_code: "WS-002", name: "Window Seat 02", type: "seat", capacity: 1, price_per_hour: 100, is_available: true },
    { id: "98765432-0000-4000-8000-000000000003", workspace_code: "SD-002", name: "Study Desk 02", type: "study", capacity: 1, price_per_hour: 80, is_available: true },
    { id: "98765432-0000-4000-8000-000000000004", workspace_code: "EF-001", name: "Elder Friendly Seat 01", type: "seat", capacity: 1, price_per_hour: 70, is_available: true },
    { id: "98765432-0000-4000-8000-000000000005", workspace_code: "EF-002", name: "Elder Friendly Seat 02", type: "seat", capacity: 1, price_per_hour: 70, is_available: true },
    { id: "98765432-0000-4000-8000-000000000006", workspace_code: "EF-005", name: "Elder Friendly Seat 05", type: "seat", capacity: 1, price_per_hour: 70, is_available: true },
    { id: "98765432-0000-4000-8000-000000000007", workspace_code: "EF-006", name: "Elder Friendly Seat 06", type: "seat", capacity: 1, price_per_hour: 70, is_available: true },
    { id: "98765432-0000-4000-8000-000000000008", workspace_code: "T-2S-5", name: "Desk T-2S-5 (2 Seater)", type: "study", capacity: 2, price_per_hour: 120, is_available: true },
    { id: "98765432-0000-4000-8000-000000000009", workspace_code: "PB-001", name: "Private Booth 01", type: "study", capacity: 6, price_per_hour: 250, is_available: true },
    { id: "98765432-0000-4000-8000-000000000010", workspace_code: "KZ-001", name: "Kids Zone Seat 01", type: "seat", capacity: 1, price_per_hour: 60, is_available: true },
  ];

  // Try upserting spaces rows into spaces
  const { data, error } = await supabase.from('spaces').upsert(initialSpaces, { onConflict: 'id' }).select();
  console.log("Upsert result:", data?.length, "| Error:", error);
}

run();
