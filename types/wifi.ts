export interface WifiSessionRecord {
  sessionId: string;
  userEmail?: string;
  passName: string;
  speed: string;
  duration: string;
  status: "active" | "expired" | "revoked";
  createdAt: string;
}
