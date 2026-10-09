import { getStore } from "@netlify/blobs";

const DEFAULT_LEADERBOARD = {
  flappy: [
    { name: "VajraAce", email: "vaj***@gmail.com", rawEmail: "vajraace@gmail.com", score: 38, rank: 1 },
    { name: "ShadowStrike", email: "sha***@gmail.com", rawEmail: "shadowstrike@gmail.com", score: 29, rank: 2 },
    { name: "Phoenix99", email: "pho***@gmail.com", rawEmail: "phoenix99@gmail.com", score: 24, rank: 3 },
    { name: "SkySniper", email: "sky***@gmail.com", rawEmail: "skysniper@gmail.com", score: 19, rank: 4 },
    { name: "GhostOperator", email: "gho***@gmail.com", rawEmail: "ghostoperator@gmail.com", score: 15, rank: 5 }
  ],
  runner: [
    { name: "CyberRex", email: "cyb***@gmail.com", rawEmail: "cyberrex@gmail.com", score: 642, rank: 1 },
    { name: "VajraSprint", email: "v.s***@gmail.com", rawEmail: "vajrasprint@gmail.com", score: 518, rank: 2 },
    { name: "NeonRider", email: "neo***@gmail.com", rawEmail: "neonrider@gmail.com", score: 430, rank: 3 },
    { name: "SpeedyBot", email: "spe***@gmail.com", rawEmail: "speedybot@gmail.com", score: 365, rank: 4 },
    { name: "PixelDino", email: "pix***@gmail.com", rawEmail: "pixeldino@gmail.com", score: 290, rank: 5 }
  ],
  snake: [
    { name: "ViperKing", email: "vip***@gmail.com", rawEmail: "viperking@gmail.com", score: 210, rank: 1 },
    { name: "AppleHunter", email: "app***@gmail.com", rawEmail: "applehunter@gmail.com", score: 180, rank: 2 },
    { name: "VajraClouds", email: "vaj***@gmail.com", rawEmail: "vajraclouds@gmail.com", score: 150, rank: 3 },
    { name: "Cobra9", email: "cob***@gmail.com", rawEmail: "cobra9@gmail.com", score: 120, rank: 4 },
    { name: "GreenMamba", email: "gre***@gmail.com", rawEmail: "greenmamba@gmail.com", score: 90, rank: 5 }
  ]
};

const BANNED_PATTERNS = [
  "fuck", "shit", "bitch", "asshole", "cunt", "dick", "pussy", "nigger", "nigga",
  "faggot", "bastard", "whore", "slut", "cock", "retard", "chutiya", "madarchod",
  "bhenchod", "gaand", "randi", "harami", "bsdk", "mc", "bc", "behenchod"
];

function containsProfanity(text) {
  if (!text) return false;
  let clean = text.toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[+]/g, "t")
    .replace(/[^a-z0-9]/g, "");
  for (const word of BANNED_PATTERNS) {
    if (clean.includes(word)) return true;
  }
  return false;
}

function getMaskedEmail(email) {
  if (!email || !email.includes("@")) return "player***@gmail.com";
  return email.replace(/(.{2,3})(.*)(@gmail\.com)/i, "$1***$3");
}

export default async (req, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const store = getStore("nav-arcade-leaderboard");

    // Fetch existing data or fallback to defaults
    let data;
    try {
      const raw = await store.get("scores", { type: "json" });
      data = raw || JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    } catch (e) {
      data = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    }

    if (!data.flappy) data.flappy = DEFAULT_LEADERBOARD.flappy;
    if (!data.runner) data.runner = DEFAULT_LEADERBOARD.runner;
    if (!data.snake) data.snake = DEFAULT_LEADERBOARD.snake;

    if (req.method === "GET") {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "POST") {
      const payload = await req.json();
      const { game, name, email, score } = payload;

      if (!game || !data[game]) {
        return new Response(JSON.stringify({ error: "Invalid game" }), { status: 400, headers: corsHeaders });
      }

      if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
        return new Response(JSON.stringify({ error: "Invalid Gmail address" }), { status: 400, headers: corsHeaders });
      }

      const cleanName = (name || "").trim().slice(0, 16);
      if (cleanName.length < 3 || containsProfanity(cleanName)) {
        return new Response(JSON.stringify({ error: "Invalid or moderated gamer tag" }), { status: 400, headers: corsHeaders });
      }

      const numScore = parseInt(score, 10);
      if (isNaN(numScore) || numScore <= 0) {
        return new Response(JSON.stringify({ error: "Invalid score" }), { status: 400, headers: corsHeaders });
      }

      const userRawEmail = email.toLowerCase().trim();
      const userMasked = getMaskedEmail(userRawEmail);

      const list = data[game] || [];
      const existingIdx = list.findIndex(p => {
        const pEmail = (p.rawEmail || p.email || "").toLowerCase().trim();
        return pEmail === userRawEmail || p.name.toLowerCase() === cleanName.toLowerCase();
      });

      let isNewBest = false;
      if (existingIdx !== -1) {
        list[existingIdx].name = cleanName;
        list[existingIdx].rawEmail = userRawEmail;
        list[existingIdx].email = userMasked;
        if (numScore > list[existingIdx].score) {
          list[existingIdx].score = numScore;
          isNewBest = true;
        }
      } else {
        list.push({
          name: cleanName,
          rawEmail: userRawEmail,
          email: userMasked,
          score: numScore
        });
        isNewBest = true;
      }

      // Sort descending
      list.sort((a, b) => b.score - a.score);
      list.forEach((item, idx) => {
        item.rank = idx + 1;
      });

      // Keep top 50
      data[game] = list.slice(0, 50);

      // Save to Netlify Blobs!
      await store.setJSON("scores", data);

      const playerRank = list.findIndex(p => (p.rawEmail || p.email) === userRawEmail || p.name.toLowerCase() === cleanName.toLowerCase()) + 1;

      return new Response(JSON.stringify({
        success: true,
        rank: playerRank > 0 ? playerRank : 1,
        newBest: isNewBest,
        data: data
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
