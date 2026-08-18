import { SeatDetails } from "@/components/customer/live-status/SeatMap";
import { supabase } from "@/lib/supabase";
import { calculateWorkspacePrice } from "@/lib/reservation";

export interface WorkspaceCardData extends Omit<SeatDetails, 'capacity'> {
  name: string;
  capacity: string;
  price: string;
  image: string;
  amenities: string[];
  realTimeStatus?: "AVAILABLE" | "PARTIALLY BOOKED" | "CURRENTLY OCCUPIED" | "FULLY BOOKED";
  statusMessage?: string;
  categories: string[];
}

export async function fetchAllWorkspaces(): Promise<WorkspaceCardData[]> {
  const { data: seatsData, error: seatsError } = await supabase.from('seats').select('*');
  if (seatsError) {
    console.error("Error fetching seats:", seatsError);
    return [];
  }
  const seats = seatsData || [];
  
  const today = new Date().toISOString().split("T")[0];
  
  const { data: reservationsData, error: resError } = await supabase
    .from('reservation')
    .select('*')
    .eq('booking_date', today)
    .in('status', ['confirmed', 'checked_in', 'pending']);
    
  if (resError) {
    console.error("Error fetching reservations:", resError);
  }
  const activeBookings = reservationsData || [];
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(":");
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  };

  return seats.map((seat) => {
    const desc = seat.seat_code || "";
    const image = seat.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";

    const zoneStr = seat.zone || "";
    const categories: string[] = ["All Seats"];
    
    // Map DB zone to UI category
    if (zoneStr === "Work & Study") { categories.push("Work & Study"); }
    else if (zoneStr === "Outdoor") { categories.push("Outdoor"); }
    else if (zoneStr === "Social Area") { categories.push("Social Area"); }
    else if (zoneStr === "Private Booths") { categories.push("Private Booths", "Work & Study"); }
    else if (zoneStr === "Kids Zone") { categories.push("Kids Zone"); }
    else if (zoneStr === "Family Zone") { categories.push("Family Zone"); }
    else if (zoneStr === "Elder Friendly") { categories.push("Elder Friendly"); }
    else if (zoneStr === "Lounges") { categories.push("Lounges", "Social Area"); }

    const friendlyName = seat.seat_name || desc;
    const zone = zoneStr;

    // Filter active reservations for this seat
    const spaceBookings = activeBookings.filter(b => b.seat_code === seat.seat_code);
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

    if (!seat.is_available) {
      realTimeStatus = "FULLY BOOKED";
      statusMessage = "Space is currently under maintenance";
    }

    const actualPricePerHour = (seat.price_per_hour && seat.price_per_hour > 0) ? seat.price_per_hour : undefined;
    const basePrice = calculateWorkspacePrice(seat.seat_type || "2 Seater", 1, 1, actualPricePerHour);

    return {
      id: seat.id,
      seat_code: seat.seat_code,
      seat_name: seat.seat_name,
      number: desc || seat.seat_name,
      name: friendlyName,
      zone: zone,
      area: zone,
      seatType: seat.seat_type,
      status: seat.is_available ? "available" : "maintenance",
      capacity: `${seat.capacity} ${seat.capacity > 1 ? "People" : "Person"}`,
      price: `₹${basePrice}/hr`, 
      price_per_hour: actualPricePerHour,
      is_available: seat.is_available,
      image: image,
      amenities: Array.isArray(seat.features) && seat.features.length > 0 ? seat.features : ["Wi-Fi", "Power Outlet"],
      realTimeStatus,
      statusMessage,
      categories
    };
  });
}
