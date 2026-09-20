import express from "express";
import cors    from "cors";
import dotenv  from "dotenv";

import generateItinerary  from "./api/generate-itinerary.js";
import getWeather         from "./api/get-weather.js";
import calculateBudget    from "./api/calculate-budget.js";
import uploadGarment      from "./api/upload-garment.js";
import suggestOutfits     from "./api/suggest-outfits.js";
import suitabilityScore   from "./api/suitability-score.js";
import colorMatch         from "./api/color-match.js";
import chatConcierge      from "./api/chat-concierge.js";
import getTransportOptions from "./api/get-transport-options.js";
import findSimilarItems   from "./api/find-similar-items.js";

dotenv.config();

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.all("/api/generate-itinerary",   (req,res) => generateItinerary(req,res));
app.all("/api/get-weather",          (req,res) => getWeather(req,res));
app.all("/api/calculate-budget",     (req,res) => calculateBudget(req,res));
app.all("/api/upload-garment",       (req,res) => uploadGarment(req,res));
app.all("/api/suggest-outfits",      (req,res) => suggestOutfits(req,res));
app.all("/api/suitability-score",    (req,res) => suitabilityScore(req,res));
app.all("/api/color-match",          (req,res) => colorMatch(req,res));
app.all("/api/chat-concierge",       (req,res) => chatConcierge(req,res));
app.all("/api/get-transport-options",(req,res) => getTransportOptions(req,res));
app.all("/api/find-similar-items",   (req,res) => findSimilarItems(req,res));

app.listen(PORT, () => {
  console.log(`\n  Trip Drip API — India Edition\n  http://localhost:${PORT}\n`);
});