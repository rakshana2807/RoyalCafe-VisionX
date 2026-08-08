export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

export function createNotification(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
): SystemNotification {
  return {
    id: `notif-${Date.now()}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
  };
}
