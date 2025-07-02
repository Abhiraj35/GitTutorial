import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getTutorialFromRepo } from "./getTutorialFromRepo.js";
import { fetchGitContent } from "./fetchGitContent.js";


const app = express();
const PORT = 8000;
const coresOptions = {
  origin: ["http://localhost:5173","https://git-tutorials.netlify.app"],
  credentials: true
}
app.use(cors());
app.use(bodyParser.json());

app.post("/api/tutorial", async (req, res) => {
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