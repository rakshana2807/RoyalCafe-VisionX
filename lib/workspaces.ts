import { supabase } from "@/lib/supabase";
import { SeatDetails } from "@/components/customer/live-status/SeatMap";

export interface WorkspaceCardData extends SeatDetails {
  name: string;
  capacity: string;
  price: string;
  image: string;
  amenities: string[];
  realTimeStatus?: "AVAILABLE" | "PARTIALLY BOOKED" | "CURRENTLY OCCUPIED" | "FULLY BOOKED";
  statusMessage?: string;
  categories: string[];
}

export function getSeatMetadata(id: string, defaultName: string): { name: string, categories: string[] } {
  let name = defaultName;
  const categories: string[] = ["All Seats"];

  if (id.startsWith("#Q01-1")) { name = "Quiet Study Table 01"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q02-1")) { name = "Quiet Study Table 02"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q03-1")) { name = "Quiet Study Table 03"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q04-1")) { name = "Quiet Study Table 04"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q05-1")) { name = "Quiet Study Table 05"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q06-1")) { name = "Quiet Study Table 06"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q07-1")) { name = "Quiet Study Table 07"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q08-1")) { name = "Quiet Study Table 08"; categories.push("Work & Study"); }

  else if (id.startsWith("#Q01-2")) { name = "Quiet Study Table 01 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q02-2")) { name = "Quiet Study Table 02 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q03-2")) { name = "Quiet Study Table 03 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q04-2")) { name = "Quiet Study Table 04 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q05-2")) { name = "Quiet Study Table 05 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q06-2")) { name = "Quiet Study Table 06 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q07-2")) { name = "Quiet Study Table 07 (2 Seats)"; categories.push("Work & Study"); }
  else if (id.startsWith("#Q08-2")) { name = "Quiet Study Table 08 (2 Seats)"; categories.push("Work & Study"); }

  else if (id.startsWith("#Q01-6")) { name = "Quiet Group Table 01 (6 Seats)"; categories.push("Work & Study", "Private Booths"); }
  else if (id.startsWith("#Q02-6")) { name = "Quiet Group Table 02 (6 Seats)"; categories.push("Work & Study", "Private Booths"); }

  else if (id.startsWith("#S09-1")) { name = "Social Table 01"; categories.push("Social Area"); }
  else if (id.startsWith("#S10-1")) { name = "Social Table 02"; categories.push("Social Area"); }
  else if (id.startsWith("#S11-1")) { name = "Social Table 03"; categories.push("Social Area"); }
  else if (id.startsWith("#S12-1")) { name = "Social Table 04"; categories.push("Social Area"); }
  else if (id.startsWith("#S13-1")) { name = "Social Table 05"; categories.push("Social Area"); }
  else if (id.startsWith("#S14-1")) { name = "Social Table 06"; categories.push("Social Area"); }
  else if (id.startsWith("#S15-1")) { name = "Social Table 07"; categories.push("Social Area"); }
  else if (id.startsWith("#S16-1")) { name = "Social Table 08"; categories.push("Social Area"); }

  else if (id.startsWith("#S01-4")) { name = "Family Table 01 (4 Seats)"; categories.push("Family Zone", "Social Area"); }
  else if (id.startsWith("#S02-4")) { name = "Family Table 02 (4 Seats)"; categories.push("Family Zone", "Social Area"); }
  else if (id.startsWith("#S03-4")) { name = "Family Table 03 (4 Seats)"; categories.push("Family Zone", "Social Area"); }
  else if (id.startsWith("#S04-4")) { name = "Family Table 04 (4 Seats)"; categories.push("Family Zone", "Social Area"); }

  else if (id.startsWith("#S01-10")) { name = "Family Table 01 (10 Seats)"; categories.push("Family Zone", "Private Booths"); }
  else if (id.startsWith("#S02-10")) { name = "Family Table 02 (10 Seats)"; categories.push("Family Zone", "Private Booths"); }
  else if (id.startsWith("#S03-10")) { name = "Family Table 03 (10 Seats)"; categories.push("Family Zone", "Private Booths"); }
  else if (id.startsWith("#S04-10")) { name = "Family Table 04 (10 Seats)"; categories.push("Family Zone", "Private Booths"); }
  else if (id.startsWith("#S05-10")) { name = "Family Table 05 (10 Seats)"; categories.push("Family Zone", "Private Booths"); }

  else if (id.startsWith("#O01-1")) { name = "Garden Table 01 (1 Seat)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O02-1")) { name = "Garden Table 02 (1 Seat)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O03-1")) { name = "Garden Table 03 (1 Seat)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O04-1")) { name = "Garden Table 04 (1 Seat)"; categories.push("Outdoor", "Social Area"); }

  else if (id.startsWith("#O01-2")) { name = "Garden Table 01 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O02-2")) { name = "Garden Table 02 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O03-2")) { name = "Garden Table 03 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O04-2")) { name = "Garden Table 04 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O05-2")) { name = "Garden Table 05 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O06-2")) { name = "Garden Table 06 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O07-2")) { name = "Garden Table 07 (2 Seats)"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#O08-2")) { name = "Garden Table 08 (2 Seats)"; categories.push("Outdoor", "Social Area"); }

  else if (id.startsWith("#A1")) { name = "Outdoor Party Area 01"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#A2")) { name = "Outdoor Party Area 02"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#A3")) { name = "Outdoor Party Area 03"; categories.push("Outdoor", "Social Area"); }
  else if (id.startsWith("#A4")) { name = "Outdoor Party Area 04"; categories.push("Outdoor", "Social Area"); }

  else if (id.startsWith("#OL01-15")) { name = "Indoor Social Lounge (15 Seats)"; categories.push("Lounges", "Social Area"); }
  else if (id.startsWith("#IL02-15")) { name = "Outdoor Social Lounge (15 Seats)"; categories.push("Lounges", "Social Area", "Outdoor"); }

  else if (id.startsWith("#K01")) { name = "Kids Corner 01"; categories.push("Kids Zone"); }
  else if (id.startsWith("#K02")) { name = "Kids Corner 02"; categories.push("Kids Zone"); }
  else if (id.startsWith("#K03")) { name = "Kids Corner 03"; categories.push("Kids Zone"); }
  else if (id.startsWith("#K04")) { name = "Kids Corner 04"; categories.push("Kids Zone"); }
  else if (id.startsWith("#K05")) { name = "Kids Corner 05"; categories.push("Kids Zone"); }
  else if (id.startsWith("#K06")) { name = "Kids Corner 06"; categories.push("Kids Zone"); }

  else if (id.startsWith("#E01")) { name = "Elder Comfort Seat 01"; categories.push("Elder Friendly"); }
  else if (id.startsWith("#E02")) { name = "Elder Comfort Seat 02"; categories.push("Elder Friendly"); }
  else if (id.startsWith("#E03")) { name = "Elder Comfort Seat 03"; categories.push("Elder Friendly"); }
  else if (id.startsWith("#E04")) { name = "Elder Comfort Seat 04"; categories.push("Elder Friendly"); }
  else if (id.startsWith("#E05")) { name = "Elder Comfort Seat 05"; categories.push("Elder Friendly"); }
  else if (id.startsWith("#E06")) { name = "Elder Comfort Seat 06"; categories.push("Elder Friendly"); }

  return { name, categories };
}

export async function fetchAllWorkspaces(): Promise<WorkspaceCardData[]> {
  const { data, error } = await supabase.from("spaces").select("*");
  
  if (error) {
    console.error("Failed to fetch spaces:", error);
    return [];
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const { data: bookingsData } = await supabase
    .from("bookings")
    .select("space_id, start_time, end_time, status")
    .eq("booking_date", todayStr)
    .in("status", ["confirmed", "checked_in"]);

  const activeBookings = bookingsData || [];

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (data || []).map((space) => {
    let image = "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80";
    if (space.type?.toLowerCase().includes("booth")) {
      image = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80";
    } else if (space.type?.toLowerCase().includes("lounge")) {
      image = "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80";
    } else if (space.capacity > 1) {
      image = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";
    }

    const desc = space.description || "";
    const metadata = getSeatMetadata(desc, space.name);
    const friendlyName = metadata.name;
    const categories = metadata.categories;

    // To maintain compatibility with existing SeatMap properties, keep zone/area 
    // derived from categories or desc.
    const zone = categories.length > 1 ? categories[1] : categories[0];

    const spaceBookings = activeBookings.filter(b => b.space_id === space.id);
    let realTimeStatus: "AVAILABLE" | "PARTIALLY BOOKED" | "CURRENTLY OCCUPIED" | "FULLY BOOKED" = "AVAILABLE";
    let statusMessage = "All time slots available now";

    if (spaceBookings.length > 0) {
      let isOccupiedNow = false;
      let totalBookedMinutes = 0;
      let nextAvailableTime = "";

      spaceBookings.sort((a, b) => parseTime(a.start_time) - parseTime(b.start_time));

      for (const b of spaceBookings) {
        const start = parseTime(b.start_time);
        const end = parseTime(b.end_time);
        totalBookedMinutes += (end - start);

        if (currentMinutes >= start && currentMinutes < end) {
          isOccupiedNow = true;
          const endHr = Math.floor(end / 60);
          const endMin = end % 60;
          const period = endHr >= 12 ? "PM" : "AM";
          const displayHr = endHr % 12 || 12;
          nextAvailableTime = `${String(displayHr).padStart(2, "0")}:${String(endMin).padStart(2, "0")} ${period}`;
        }
      }

      const operatingMinutes = 13 * 60; 
      
      if (totalBookedMinutes >= operatingMinutes) {
        realTimeStatus = "FULLY BOOKED";
        statusMessage = "No slots available today";
      } else if (isOccupiedNow) {
        realTimeStatus = "CURRENTLY OCCUPIED";
        statusMessage = `Available from: ${nextAvailableTime}`;
      } else {
        realTimeStatus = "PARTIALLY BOOKED";
        const nextBooking = spaceBookings.find(b => parseTime(b.start_time) > currentMinutes);
        if (nextBooking) {
          const start = parseTime(nextBooking.start_time);
          const hr = Math.floor(start / 60);
          const min = start % 60;
          const p = hr >= 12 ? "PM" : "AM";
          const dHr = hr % 12 || 12;
          statusMessage = `Next Available: ${String(dHr).padStart(2, "0")}:${String(min).padStart(2, "0")} ${p}`;
        } else {
          statusMessage = "Available for the rest of the day";
        }
      }
    }

    if (!space.is_available) {
      realTimeStatus = "FULLY BOOKED";
      statusMessage = "Space is currently under maintenance";
    }

    return {
      id: space.id,
      number: desc || space.name,
      name: friendlyName,
      zone: zone,
      area: zone,
      seatType: space.type,
      status: space.is_available ? "available" : "maintenance",
      capacity: `${space.capacity} ${space.capacity > 1 ? "People" : "Person"}`,
      price: `₹${space.price_per_hour}/hr`, 
      image: space.image_url || image,
      amenities: Array.isArray(space.features) && space.features.length > 0 ? space.features : ["Wi-Fi", "Power Outlet"],
      realTimeStatus,
      statusMessage,
      categories
    };
  });
}
