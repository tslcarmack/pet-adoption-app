/**
 * Sanitize user input to prevent XSS attacks
 */

/**
 * Remove HTML tags from string
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(input: string): string {
  const htmlEscapeMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize string input
 * Removes HTML tags and trims whitespace
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";
  return stripHtml(input.trim());
}

/**
 * Sanitize email
 * Validates basic email format and removes dangerous characters
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[<>()[\]\\,;:\s@"]+/g, "");
}

/**
 * Sanitize phone number
 * Removes all non-numeric characters except + and -
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+-]/g, "");
}

/**
 * Sanitize URL
 * Basic URL validation
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize object with string values
 * Applies sanitizeString to all string properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = { ...obj };
  
  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else if (value && typeof value === "object") {
      sanitized[key] = sanitizeObject(value);
    }
  });
  
  return sanitized as T;
}
