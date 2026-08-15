const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  'https://uzqorbyizhehfyltwdhj.supabase.co',
  'sb_publishable_jDEoeDp-5Ii_Ae6i9YWwgA_QgKuUkt8'
);

function generateUUID(customId) {
  const hash = crypto.createHash('md5').update(customId).digest('hex');
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-a${hash.substring(17, 20)}-${hash.substring(20, 32)}`;
}

const spacesData = [];

function addSpace(customId, name, type, capacity, price_per_hour, features) {
  spacesData.push({
    id: generateUUID(customId),
    name: name,
    type: type,
    description: customId,
    capacity: capacity,
    price_per_hour: price_per_hour,
    features: features,
    is_available: true,
  });
}

// SINGLE SEATER TABLES (Outdoor)
for(let i=1; i<=4; i++) addSpace(`#O0${i}-1`, `Outdoor Single Table 0${i}`, `Single Seater`, 1, 25, ["WiFi", "Outdoor"]);
// SINGLE SEATER TABLES (Indoor - Quiet Zone)
for(let i=1; i<=8; i++) addSpace(`#Q0${i}-1`, `Quiet Zone Single Desk 0${i}`, `Single Seater`, 1, 25, ["WiFi", "Quiet Area", "Power"]);
// 2-SEATER TABLES (Indoor - Quiet Zone)
for(let i=1; i<=8; i++) addSpace(`#Q0${i}-2`, `Quiet Zone 2-Seater 0${i}`, `2 Seater`, 2, 45, ["WiFi", "Quiet Area", "Power"]);
// 2-SEATER TABLES (Outdoor - Social Zone)
for(let i=1; i<=8; i++) addSpace(`#O0${i}-2`, `Outdoor Social 2-Seater 0${i}`, `2 Seater`, 2, 45, ["WiFi", "Outdoor"]);
// OUTDOOR PARTY AREA
addSpace(`#A1-8`, `Outdoor Party Area 01`, `Lounge`, 8, 120, ["Outdoor", "Large Group"]);
addSpace(`#A2-8`, `Outdoor Party Area 02`, `Lounge`, 8, 120, ["Outdoor", "Large Group"]);
addSpace(`#A3-8`, `Outdoor Party Area 03`, `Lounge`, 8, 120, ["Outdoor", "Large Group"]);
addSpace(`#A4`, `Outdoor Party Area 04`, `Lounge`, 8, 120, ["Outdoor", "Large Group"]);
// OUTDOOR LOUNGE
addSpace(`#OL01-15`, `Outdoor Lounge 01`, `Lounge`, 15, 120, ["Outdoor", "Lounge Seating"]);
// 6-SEATER TABLES (Indoor - Private Booth)
for(let i=1; i<=3; i++) addSpace(`#Q0${i}-6`, `Private Booth 6-Seater 0${i}`, `Private Booths (6 Seater)`, 6, 180, ["Private", "Power", "Display"]);
// 10-SEATER TABLES (Indoor - Private Booth)
for(let i=1; i<=5; i++) addSpace(`#S0${i}-10`, `Private Booth 10-Seater 0${i}`, `Booths (10 Seater)`, 10, 180, ["Private", "Power", "Display"]);
// 4-SEATER TABLES (Indoor - Social Zone)
for(let i=1; i<=4; i++) addSpace(`#S0${i}-4`, `Social Zone 4-Seater 0${i}`, `4 Seater`, 4, 85, ["Social", "Power"]);
// SINGLE SEATER TABLES (Indoor - Social Zone)
for(let i=9; i<=16; i++) addSpace(`#S${i.toString().padStart(2, '0')}-1`, `Social Zone Single Desk ${i.toString().padStart(2, '0')}`, `Single Seater`, 1, 25, ["Social", "Power"]);
// SOCIAL LOUNGE (Indoor)
addSpace(`#IL02-15`, `Indoor Social Lounge 02`, `Lounge`, 15, 120, ["Social", "Lounge Seating"]);
// KIDS ZONE (INDOOR)
for(let i=1; i<=6; i++) addSpace(`#K0${i}-2`, `Kids Zone Table 0${i}`, `Kids Zone`, 2, 45, ["Kids Friendly"]);
// ELDER ZONE (INDOOR)
for(let i=1; i<=6; i++) addSpace(`#E0${i}-2`, `Elder Zone Table 0${i}`, `Elder Friendly`, 2, 45, ["Accessible", "Quiet Area"]);

async function run() {
  console.log(`Seeding ${spacesData.length} spaces...`);
  const { data, error } = await supabase.from('spaces').upsert(spacesData, { onConflict: 'id' }).select('id, name, description');
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Success! Inserted spaces.");
  }
}

run();
