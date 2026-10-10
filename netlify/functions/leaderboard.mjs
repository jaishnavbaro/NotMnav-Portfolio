import { getStore } from "@netlify/blobs";

// 100% Brand new, empty leaderboard - awaiting real players
const DEFAULT_LEADERBOARD = {
  flappy: [],
  runner: [],
  snake: []
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

// Strict Real Gmail Validation
// Google rules: 6-30 alphanumeric characters & dots; no leading/trailing dot; no consecutive dots
function isValidRealGmail(email) {
  if (!email || typeof email !== "string") return false;
  const clean = email.toLowerCase().trim();
  const gmailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9.]{4,28}[a-zA-Z0-9]@gmail\.com$/;
  if (!gmailRegex.test(clean)) return false;
  const username = clean.replace("@gmail.com", "");
  const knownFakes = ["test", "admin", "fake", "asdf", "123456", "example", "user", "abc", "player", "demo"];
  if (knownFakes.includes(username)) return false;
  return true;
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

    // Fresh storage key "scores_v3" guarantees old dummy data is completely cleared
    let data;
    try {
      const raw = await store.get("scores_v3", { type: "json" });
      data = raw || JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    } catch (e) {
      data = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    }

    if (!Array.isArray(data.flappy)) data.flappy = [];
    if (!Array.isArray(data.runner)) data.runner = [];
    if (!Array.isArray(data.snake)) data.snake = [];

    // Registered users database in Netlify Blobs
    let users = {};
    try {
      const rawUsers = await store.get("users_v3", { type: "json" });
      users = rawUsers || {};
    } catch (e) {
      users = {};
    }

    // MacBook Goal Supporters & Donors database in Netlify Blobs
    let supporterData = { goal: 170000, totalRaised: 0, supporters: [] };
    try {
      const rawSupporters = await store.get("supporters_v1", { type: "json" });
      if (rawSupporters) supporterData = rawSupporters;
    } catch (e) {
      supporterData = { goal: 170000, totalRaised: 0, supporters: [] };
    }
    if (!Array.isArray(supporterData.supporters)) supporterData.supporters = [];

    // Filter to strictly VERIFIED donors for public display (unverified/pending are hidden from public)
    const verifiedSupporters = (supporterData.supporters || [])
      .filter(s => s.verified === true)
      .sort((a, b) => b.amount - a.amount || b.timestamp - a.timestamp);
    verifiedSupporters.forEach((item, idx) => {
      item.rank = idx + 1;
    });
    const verifiedTotalRaised = verifiedSupporters.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    // GET: Return current fresh leaderboard data + Verified MacBook Goal Supporters
    if (req.method === "GET") {
      const responseData = {
        ...data,
        supporters: verifiedSupporters,
        totalRaised: verifiedTotalRaised,
        goal: supporterData.goal || 170000
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "POST") {
      const payload = await req.json();
      const action = payload.action || "submit-score";

      // ---------------------------------------------------------------
      // ACTION: REGISTER (Create new account with Gmail + Password)
      // ---------------------------------------------------------------
      if (action === "register") {
        const { email, name, passwordHash } = payload;
        const cleanEmail = (email || "").toLowerCase().trim();
        const cleanName = (name || "").trim().slice(0, 16);

        if (!isValidRealGmail(cleanEmail)) {
          return new Response(JSON.stringify({
            error: "Please enter a valid, authentic Gmail address (6-30 characters ending with @gmail.com)."
          }), { status: 400, headers: corsHeaders });
        }

        if (cleanName.length < 3 || cleanName.length > 16 || containsProfanity(cleanName)) {
          return new Response(JSON.stringify({
            error: "Gamer tag must be 3-16 characters and contain no inappropriate words."
          }), { status: 400, headers: corsHeaders });
        }

        if (!passwordHash || passwordHash.length < 10) {
          return new Response(JSON.stringify({
            error: "Password is required (minimum 6 characters)."
          }), { status: 400, headers: corsHeaders });
        }

        if (users[cleanEmail]) {
          return new Response(JSON.stringify({
            error: "An account with this Gmail already exists. Please Log In instead."
          }), { status: 409, headers: corsHeaders });
        }

        users[cleanEmail] = {
          email: cleanEmail,
          name: cleanName,
          passwordHash: passwordHash,
          createdAt: new Date().toISOString()
        };

        await store.setJSON("users_v3", users);

        return new Response(JSON.stringify({
          success: true,
          user: {
            email: cleanEmail,
            displayName: cleanName
          }
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: LOGIN (Sign in with Gmail + Password)
      // ---------------------------------------------------------------
      if (action === "login") {
        const { email, passwordHash } = payload;
        const cleanEmail = (email || "").toLowerCase().trim();

        if (!isValidRealGmail(cleanEmail)) {
          return new Response(JSON.stringify({
            error: "Please enter a valid @gmail.com address."
          }), { status: 400, headers: corsHeaders });
        }

        const user = users[cleanEmail];
        if (!user) {
          return new Response(JSON.stringify({
            error: "No account found with this Gmail. Click 'Create Account' to sign up first!"
          }), { status: 404, headers: corsHeaders });
        }

        if (user.passwordHash !== passwordHash) {
          return new Response(JSON.stringify({
            error: "Incorrect password. Please verify your credentials and try again."
          }), { status: 401, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          success: true,
          user: {
            email: user.email,
            displayName: user.name
          }
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: RESET LEADERBOARD (Clear all scores to start fresh)
      // ---------------------------------------------------------------
      if (action === "reset") {
        data = { flappy: [], runner: [], snake: [] };
        await store.setJSON("scores_v3", data);
        return new Response(JSON.stringify({
          success: true,
          message: "Leaderboard cleared and reset.",
          data: data
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: SUBMIT-DONATION (Record supporter contribution for verification)
      // ---------------------------------------------------------------
      if (action === "submit-donation") {
        const { name, email, amount, message, utr } = payload;
        const cleanName = (name || "").trim().slice(0, 24);
        const numAmount = parseInt(amount, 10);
        const cleanMessage = (message || "").trim().slice(0, 140);
        const cleanUtr = (utr || "").replace(/[^a-zA-Z0-9]/g, "").trim().slice(0, 32);
        const cleanEmail = (email || "").toLowerCase().trim();

        if (!cleanName || cleanName.length < 2) {
          return new Response(JSON.stringify({
            error: "Please enter your name or display tag (at least 2 characters)."
          }), { status: 400, headers: corsHeaders });
        }

        if (containsProfanity(cleanName) || containsProfanity(cleanMessage)) {
          return new Response(JSON.stringify({
            error: "Please keep donor names and messages friendly and appropriate."
          }), { status: 400, headers: corsHeaders });
        }

        if (isNaN(numAmount) || numAmount < 1) {
          return new Response(JSON.stringify({
            error: "Please specify a valid contribution amount of at least ₹1."
          }), { status: 400, headers: corsHeaders });
        }

        if (!cleanUtr || cleanUtr.length < 6) {
          return new Response(JSON.stringify({
            error: "Please enter a valid 12-digit UPI Reference (UTR) number from your payment receipt."
          }), { status: 400, headers: corsHeaders });
        }

        const list = supporterData.supporters || [];

        // Check if UTR is duplicate
        const utrExists = list.some(item => (item.utr || "").toLowerCase() === cleanUtr.toLowerCase());
        if (utrExists) {
          return new Response(JSON.stringify({
            error: "This UPI Reference (UTR) number has already been submitted."
          }), { status: 400, headers: corsHeaders });
        }

        const donationEntry = {
          id: "don_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          name: cleanName,
          amount: numAmount,
          message: cleanMessage || "Supporting Jaishnav's MacBook goal! 💻✨",
          email: cleanEmail.includes("@") ? getMaskedEmail(cleanEmail) : "",
          utr: cleanUtr,
          verified: false,
          status: "pending",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          timestamp: Date.now()
        };

        list.push(donationEntry);
        supporterData.supporters = list;

        await store.setJSON("supporters_v1", supporterData);

        return new Response(JSON.stringify({
          success: true,
          status: "pending",
          message: "Payment submitted for review! Once Jaishnav verifies the transaction in FamPay, your name will appear on the Top Supporters Wall.",
          entry: donationEntry
        }), { status: 200, headers: corsHeaders });
      }

      // Read admin passkey (configured in Blobs or default "nav_admin_7788")
      let currentAdminPasskey = process.env.NAV_ADMIN_SECRET || "nav_admin_7788";
      try {
        const config = await store.get("admin_config_v1", { type: "json" });
        if (config && config.passkey) currentAdminPasskey = config.passkey;
      } catch (e) {}

      // ---------------------------------------------------------------
      // ACTION: ADMIN-LOGIN (Validate owner passkey)
      // ---------------------------------------------------------------
      if (action === "admin-login") {
        const { passkey } = payload;
        if (passkey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Incorrect admin passkey." }), { status: 401, headers: corsHeaders });
        }
        return new Response(JSON.stringify({ success: true, message: "Authorized." }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: ADMIN-GET-DONATIONS (View all pending & approved)
      // ---------------------------------------------------------------
      if (action === "admin-get-donations") {
        const { passkey } = payload;
        if (passkey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: corsHeaders });
        }
        return new Response(JSON.stringify({
          success: true,
          donations: supporterData.supporters || [],
          goal: supporterData.goal || 170000
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: ADMIN-APPROVE-DONATION (Approve genuine payment)
      // ---------------------------------------------------------------
      if (action === "admin-approve-donation") {
        const { passkey, id } = payload;
        if (passkey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: corsHeaders });
        }

        const list = supporterData.supporters || [];
        const target = list.find(d => d.id === id);
        if (!target) {
          return new Response(JSON.stringify({ error: "Donation entry not found." }), { status: 404, headers: corsHeaders });
        }

        target.verified = true;
        target.status = "approved";

        // Recalculate verified ranks
        const verified = list.filter(d => d.verified === true);
        verified.sort((a, b) => b.amount - a.amount || b.timestamp - a.timestamp);
        verified.forEach((item, idx) => { item.rank = idx + 1; });

        const newTotalRaised = verified.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        supporterData.totalRaised = newTotalRaised;
        supporterData.supporters = list;

        await store.setJSON("supporters_v1", supporterData);

        return new Response(JSON.stringify({
          success: true,
          donations: list,
          totalRaised: newTotalRaised
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: ADMIN-REJECT-DONATION (Remove fake troll submission)
      // ---------------------------------------------------------------
      if (action === "admin-reject-donation") {
        const { passkey, id } = payload;
        if (passkey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: corsHeaders });
        }

        let list = supporterData.supporters || [];
        list = list.filter(d => d.id !== id);

        const verified = list.filter(d => d.verified === true);
        verified.sort((a, b) => b.amount - a.amount || b.timestamp - a.timestamp);
        verified.forEach((item, idx) => { item.rank = idx + 1; });

        const newTotalRaised = verified.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        supporterData.totalRaised = newTotalRaised;
        supporterData.supporters = list;

        await store.setJSON("supporters_v1", supporterData);

        return new Response(JSON.stringify({
          success: true,
          donations: list,
          totalRaised: newTotalRaised
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: ADMIN-ADD-DONATION (Manually add verified donor)
      // ---------------------------------------------------------------
      if (action === "admin-add-donation") {
        const { passkey, name, amount, message, utr } = payload;
        if (passkey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: corsHeaders });
        }

        const cleanName = (name || "").trim().slice(0, 24);
        const numAmount = parseInt(amount, 10);
        const cleanMessage = (message || "").trim().slice(0, 140);
        const cleanUtr = (utr || "").trim().slice(0, 32);

        if (!cleanName || numAmount < 1) {
          return new Response(JSON.stringify({ error: "Invalid name or amount." }), { status: 400, headers: corsHeaders });
        }

        const list = supporterData.supporters || [];
        const newEntry = {
          id: "don_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          name: cleanName,
          amount: numAmount,
          message: cleanMessage || "Direct FamPay contribution 🚀",
          email: "",
          utr: cleanUtr || ("MANUAL_" + Date.now()),
          verified: true,
          status: "approved",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          timestamp: Date.now()
        };

        list.push(newEntry);

        const verified = list.filter(d => d.verified === true);
        verified.sort((a, b) => b.amount - a.amount || b.timestamp - a.timestamp);
        verified.forEach((item, idx) => { item.rank = idx + 1; });

        const newTotalRaised = verified.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        supporterData.totalRaised = newTotalRaised;
        supporterData.supporters = list;

        await store.setJSON("supporters_v1", supporterData);

        return new Response(JSON.stringify({
          success: true,
          donations: list,
          totalRaised: newTotalRaised
        }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: ADMIN-CHANGE-PASSKEY (Change admin PIN)
      // ---------------------------------------------------------------
      if (action === "admin-change-passkey") {
        const { currentPasskey, newPasskey } = payload;
        if (currentPasskey !== currentAdminPasskey) {
          return new Response(JSON.stringify({ error: "Incorrect current passkey." }), { status: 401, headers: corsHeaders });
        }
        if (!newPasskey || newPasskey.length < 6) {
          return new Response(JSON.stringify({ error: "New passkey must be at least 6 characters." }), { status: 400, headers: corsHeaders });
        }

        await store.setJSON("admin_config_v1", { passkey: newPasskey });
        return new Response(JSON.stringify({ success: true, message: "Admin passkey updated successfully." }), { status: 200, headers: corsHeaders });
      }

      // ---------------------------------------------------------------
      // ACTION: GET-SUPPORTERS (MacBook Goal & Verified Donors list)
      // ---------------------------------------------------------------
      if (action === "get-supporters") {
        return new Response(JSON.stringify({
          supporters: verifiedSupporters,
          totalRaised: verifiedTotalRaised,
          goal: supporterData.goal || 170000
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      // ---------------------------------------------------------------
      // ACTION: SUBMIT-SCORE (Record verified player game score)
      // ---------------------------------------------------------------
      const { game, name, email, score } = payload;

      if (!game || !data[game]) {
        return new Response(JSON.stringify({ error: "Invalid game" }), { status: 400, headers: corsHeaders });
      }

      const cleanEmail = (email || "").toLowerCase().trim();
      if (!isValidRealGmail(cleanEmail)) {
        return new Response(JSON.stringify({ error: "Only verified real Gmail addresses can submit scores." }), { status: 400, headers: corsHeaders });
      }

      const cleanName = (name || "").trim().slice(0, 16);
      if (cleanName.length < 3 || containsProfanity(cleanName)) {
        return new Response(JSON.stringify({ error: "Invalid or moderated gamer tag" }), { status: 400, headers: corsHeaders });
      }

      const numScore = parseInt(score, 10);
      if (isNaN(numScore) || numScore <= 0) {
        return new Response(JSON.stringify({ error: "Invalid score" }), { status: 400, headers: corsHeaders });
      }

      const userMasked = getMaskedEmail(cleanEmail);
      const list = data[game] || [];

      const existingIdx = list.findIndex(p => {
        const pEmail = (p.rawEmail || p.email || "").toLowerCase().trim();
        return pEmail === cleanEmail || p.name.toLowerCase() === cleanName.toLowerCase();
      });

      let isNewBest = false;
      if (existingIdx !== -1) {
        list[existingIdx].name = cleanName;
        list[existingIdx].rawEmail = cleanEmail;
        list[existingIdx].email = userMasked;
        if (numScore > list[existingIdx].score) {
          list[existingIdx].score = numScore;
          isNewBest = true;
        }
      } else {
        list.push({
          name: cleanName,
          rawEmail: cleanEmail,
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
      await store.setJSON("scores_v3", data);

      const playerRank = list.findIndex(p => (p.rawEmail || p.email) === cleanEmail || p.name.toLowerCase() === cleanName.toLowerCase()) + 1;

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
