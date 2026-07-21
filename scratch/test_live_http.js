const testEmail = `user_${Date.now()}@royalcafe.com`;
const testPassword = "Password123!";

async function testLiveApis() {
  console.log("=========================================");
  console.log("TESTING LIVE APIS & BOOKING ON LOCALHOST:3001");
  console.log("=========================================");

  // 1. REGISTER TEST
  console.log("Testing Registration with email:", testEmail);
  const regRes = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Royal Test User",
      email: testEmail,
      phone: "+1 234 567 8900",
      password: testPassword,
    }),
  });

  const regStatus = regRes.status;
  const regData = await regRes.json();
  console.log("REGISTRATION RESPONSE STATUS:", regStatus);

  if (regStatus !== 200 && regStatus !== 201) {
    console.error("❌ Registration HTTP Test Failed with Status:", regStatus);
    process.exit(1);
  }

  // 2. LOGIN TEST
  console.log("\nTesting Login...");
  const loginRes = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  const loginStatus = loginRes.status;
  const loginData = await loginRes.json();
  console.log("LOGIN RESPONSE STATUS:", loginStatus);

  if (loginStatus !== 200) {
    console.error("❌ Login HTTP Test Failed");
    process.exit(1);
  }

  // 3. BOOKING CREATION WITH MENU ITEMS & WIFI PASS
  console.log("\nTesting Booking API with Menu Items & WiFi Pass...");
  const bookingRes = await fetch("http://localhost:3001/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Royal Test User",
      mobile: "+1 234 567 8900",
      email: testEmail,
      seatType: "Study Workspace",
      seatNumber: "Quiet Zone Desk #12",
      date: "25/07/2026",
      arrivalTime: "10:00 AM",
      duration: "4 Hours",
      guests: "1 Person",
      purpose: "Study",
      amount: 350,
      menuItems: [
        {
          id: "item_cappuccino_01",
          name: "Signature Cappuccino",
          category: "Coffee",
          price: 150,
          quantity: 2,
          image: "/cappuccino.png"
        },
        {
          id: "item_garlic_bread_02",
          name: "Garlic Bread with Cheese",
          category: "Food",
          price: 180,
          quantity: 1,
          image: "/garlic-bread.png"
        }
      ],
      wifiPass: {
        name: "Work Pass",
        duration: "1 Hour",
        price: 49
      },
      foodTotal: 480,
      wifiTotal: 49,
      bookingFee: 350,
      grandTotal: 923
    }),
  });

  const bookingStatus = bookingRes.status;
  const bookingData = await bookingRes.json();

  console.log("BOOKING RESPONSE STATUS:", bookingStatus);
  console.log("BOOKING RESPONSE DATA:", JSON.stringify(bookingData, null, 2));

  if (bookingStatus !== 201) {
    console.error("❌ Booking API Test Failed with Status:", bookingStatus);
    process.exit(1);
  } else {
    console.log("✅ Booking API Test Passed! Status:", bookingStatus);
  }

  console.log("\n=========================================");
  console.log("🎉 ALL LIVE API & BOOKING INTEGRATION TESTS PASSED!");
  console.log("=========================================");
}

testLiveApis().catch((err) => {
  console.error("Live test failed:", err);
  process.exit(1);
});
