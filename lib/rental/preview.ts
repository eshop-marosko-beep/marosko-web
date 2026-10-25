/** Preview deployments have their own rental database, so changes made in
 * their admin panel never reach www.marosko.sk. The admin panel is locked
 * there to stop that mix-up; the public rental pages still work for testing. */
export const LIVE_ADMIN_URL = "https://www.marosko.sk/ucet/admin";

export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
