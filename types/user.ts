export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  role: "customer" | "admin" | "staff";
  createdAt: string;
}
