export interface UserSession {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
}

export function getAuthenticatedUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("royalcafe_user") || localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed.email || parsed.id)) {
        return {
          id: parsed.id || "usr",
          name: parsed.name || parsed.email?.split("@")[0] || "User",
          email: parsed.email || "",
          phone: parsed.phone || "",
          role: parsed.role || "user",
        };
      }
    }
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email") || localStorage.getItem("adminEmail");
    if (role && email) {
      return {
        id: "usr",
        name: email.split("@")[0] || "User",
        email: email,
        role: role,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getAuthenticatedUser() !== null;
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("user");
  localStorage.removeItem("royalcafe_user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-state-change"));
}
