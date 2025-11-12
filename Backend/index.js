import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getTutorialFromRepo } from "./getTutorialFromRepo.js";
import { fetchGitContent } from "./fetchGitContent.js";
import rateLimit from 'express-rate-limit';


const app = express();
const PORT = 8000;
const corsOptions = {
  origin: ["http://localhost:5173", "https://git-tutorials.netlify.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
}

// Apply CORS before rate limiting to handle preflight requests
app.use(cors(corsOptions));
app.use(bodyParser.json());

//  Rate Limiter: max 5 requests per 10 minutes per IP
const tutorialLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 min
  max:5,
  message:{
    error: "Too many requests. Please try again after some time..."
  },
  standardHeaders:true,
  legacyHeaders:false,
});

// Apply rate limiter to POST requests only
app.post("/api/tutorial", tutorialLimiter, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const content = await fetchGitContent(repoUrl);
    const tutorial = await getTutorialFromRepo(content);
    res.json(tutorial); 
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
export default app; 