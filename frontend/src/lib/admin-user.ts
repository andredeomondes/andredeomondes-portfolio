const DEFAULT_ADMIN_EMAIL = "andredeomondes.dev@gmail.com";

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;

export function isAllowedAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
