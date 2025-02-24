// sanitize the server ip address

export function sanitizeUrl(url: string): string {
  return url.replace(/\/+/g, "/");
}
