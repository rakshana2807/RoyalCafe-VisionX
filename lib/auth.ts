import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "royalcafe_secret_key_2026";

if (!process.env.JWT_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.error("⚠️ JWT_SECRET or NEXTAUTH_SECRET is missing in environment variables (.env.local)");
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

/**
 * Hashes plain text password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) throw new Error("Password is required for hashing");
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plain text password against hashed password
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  if (!password || !hashed) return false;
  return bcrypt.compare(password, hashed);
}

/**
 * Signs JWT token with user payload
 */
export function signToken(payload: TokenPayload): string {
  if (!JWT_SECRET) {
    console.error("❌ Cannot sign JWT: JWT_SECRET is missing");
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies JWT token and returns decoded payload
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!token || !JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return null;
  }
}

/**
 * Extracts and verifies JWT payload from request cookies or Authorization header
 */
export function getAuthUser(req: NextRequest): TokenPayload | null {
  // Check cookie
  const cookieToken = req.cookies.get("auth_token")?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }

  // Check Bearer token in header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}
