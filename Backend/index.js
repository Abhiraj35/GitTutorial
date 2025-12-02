import express from "express";
import cors from "cors";
import { getTutorialFromRepo } from "./getTutorialFromRepo.js";
import { fetchGitContent } from "./fetchGitContent.js";
import rateLimit from 'express-rate-limit';


const app = express();
const PORT = 8000;
app.set("trust proxy", 1);
const defaultOrigins = ["http://localhost:5173", "https://git-tutorials.netlify.app"]; 
const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

// Apply CORS before rate limiting to handle preflight requests
app.use(cors(corsOptions));
app.use(express.json());
//  Rate Limiter: max 5 requests per 10 minutes per IP
const tutorialLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 min
  max:5,
  skip: (req) => req.method === "OPTIONS",
  message:{
    error: "Too many requests. Please try again after some time..."
  },

  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/',(req,res) => {
  res.status(200).json({message: "Welcome to gitTutorial Backend"})
})

app.get('/healthz',(req,res) => {
  res.status(200).json({message: "Health route is working"})
})
// Apply rate limiter to POST requests only
app.post("/api/tutorial", tutorialLimiter, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: "repoUrl is required" });
    }
    const content = await fetchGitContent(repoUrl);
    const tutorial = await getTutorialFromRepo(content);
    res.json(tutorial); 
  } catch (err) {
    console.error("Server error:", err);

    const message = err?.message || "";

    if (message.startsWith("Invalid GitHub repo URL")) {
      return res.status(400).json({ error: message });
    }

    if (/Github API error 404/i.test(message)) {
      return res.status(404).json({ error: "Repository not found or inaccessible." });
    }

    if (message === "Failed to parse Gemini output.") {
      return res.status(502).json({ error: "Upstream AI service returned invalid data. Please try again." });
    }

    return res.status(500).json({ error: message || "Internal server error" });
  }
});

// For Vercel serverless functions, don't call app.listen()
// Vercel handles the server lifecycle automatically
// Only start the server when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
}

// Export for Vercel serverless functions
export default app;