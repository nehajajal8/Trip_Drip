/**
 * api/get-transport-options.js
 * Dedicated transport comparison endpoint — from city, to destination, group size
 */
import { calculateTransport, INDIA_CITIES } from "../src/data/indiaTransport.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { from, to, groupSize = 1 } = req.body || {};
  if (!from || !to) return res.status(400).json({ error: "from and to required" });
  const result = calculateTransport(from, to, parseInt(groupSize)||1);
  const fromCity = INDIA_CITIES.find(c => c.name.toLowerCase()===from.toLowerCase());
  const toCity   = INDIA_CITIES.find(c => c.name.toLowerCase()===to.toLowerCase());
  return res.status(200).json({ ...result, fromCity, toCity, currency:"INR" });
}