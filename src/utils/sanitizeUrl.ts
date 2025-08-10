// sanitize the server ip address from / and http

export function sanitizeUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\//g, "");
}
