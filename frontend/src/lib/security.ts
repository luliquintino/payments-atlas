/**
 * Security utilities for Payments Academy
 * - Password hashing (SHA-256 + salt via Web Crypto API)
 * - Input sanitization
 * - Email validation
 * - Password strength assessment
 */

const SALT = "pks-salt-2026";

/**
 * Hash a password using SHA-256 with a fixed salt via the Web Crypto API.
 * Returns hex-encoded hash string.
 */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Strip HTML tags from user input to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Evaluate password strength.
 * Returns "weak", "medium", or "strong".
 */
export function getPasswordStrength(
  pw: string
): "weak" | "medium" | "strong" {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}
