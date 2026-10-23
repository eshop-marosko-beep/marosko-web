/** Where to go after signing in. Only same-site paths are accepted, so the
 * ?next= parameter can't send someone to another website. */
export function safeNextPath(value: string | string[] | undefined): string {
  const next = Array.isArray(value) ? value[0] : value;
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/pozicovna";
}
