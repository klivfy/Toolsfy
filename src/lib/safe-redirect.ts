const DEFAULT_REDIRECT = "/dashboard";

/**
 * Accepts only same-site paths ("/dashboard/billing"). Anything that could
 * leave the site ("//evil.com", "@evil.com", "/\\evil.com", "https://…")
 * falls back to the dashboard.
 */
export function safeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }
  if (value.includes("\\") || value.includes("@") || /[\u0000-\u001f]/.test(value)) {
    return DEFAULT_REDIRECT;
  }
  return value;
}
