/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const ALLOWED_PATHS = [
  "api/v1/plugins/EcoPriceCalculator/stores",
  "Layers/TerrainLatest.gif",
  "api/v1/map/map.json",
  "api/v1/plugins/EcoPriceCalculator/allItems",
];
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { server, path } = req.query;

  if (!server || !path) {
    return res.status(400).json({ error: "Missing server or path parameters" });
  }

  if (typeof server !== "string") {
    return res.status(400).json({ error: "Invalid server parameter" });
  }

  if (!ALLOWED_PATHS.includes(String(path))) {
    return res.status(400).json({ error: "Invalid path parameter" });
  }

  try {
    const targetUrl = `http://${String(server)}/${Array.isArray(path) ? path.join("/") : String(path)}`;

    const response = await axios.get(targetUrl, {
      responseType: "stream",
    });

    const contentType = response.headers["content-type"];
    if (typeof contentType === "string" || Array.isArray(contentType)) {
      res.setHeader("Content-Type", contentType);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error); // Debugging
    res.status(500).json({ error: "Failed to proxy request" });
  }
}
