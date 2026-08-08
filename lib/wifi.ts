export interface WifiPassConfig {
  id: string;
  name: string;
  speed: string;
  duration: string;
  price: number;
}

export const WIFI_PASS_PACKAGES: WifiPassConfig[] = [
  { id: "pass-1", name: "Hourly Focus Pass", speed: "100 Mbps", duration: "1 Hour", price: 49 },
  { id: "pass-2", name: "Half-Day Fiber Pass", speed: "500 Mbps", duration: "4 Hours", price: 149 },
  { id: "pass-3", name: "Full-Day Ultra Pass", speed: "1 Gbps", duration: "Full Day", price: 299 },
];

export function generateWifiAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "RC-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
