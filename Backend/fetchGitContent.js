import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// Allowed file types
const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",
  ".css",
  ".json",
  ".md",
  ".txt",
  ".py",
  ".java",
  ".ejs",
];

const maxFileSize = 40 * 1024; // 40KB
const maxTotalLength = 100000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Delay helper (to avoid rate-limit spam)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isCodeFile(filePath) {
  const ext = filePath.includes(".")
    ? filePath.slice(filePath.lastIndexOf(".")).toLowerCase()
    : "";
  return allowedExtensions.includes(ext);
}

function sanitizeContent(str) {
  return str.replace(/```/g, "").replace(/\r/g, "").replace(/\t/g, "  ").trim();
}

function prioritizeFiles(files) {
  const priority = [
    "readme.md",
    "readme.txt",
    "index.js",
    "main.js",
    "main.py",
    "app.js",
    ".env.example",
  ];

  return files.sort((a, b) => {
    const aScore = priority.findIndex((p) =>
      a.path.toLowerCase().endsWith(p)
    );
    const bScore = priority.findIndex((p) =>
      b.path.toLowerCase().endsWith(p)
    );
    return (
      (aScore === -1 ? Infinity : aScore) -
      (bScore === -1 ? Infinity : bScore)
    );
  });
}

// Authenticated fetch (with proper GitHub headers)
async function fetchWithAuth(url) {
  const headers = {
    "User-Agent": "GitTutorial-App",
    Accept: "application/vnd.github+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });

  const text = await res.text(); // text-first to prevent parse crash

  if (!res.ok) {
    throw new Error(
      `GitHub API error ${res.status}: ${text.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("GitHub API returned invalid JSON.");
  }
}

// Authenticated RAW fetch (for file content)
async function fetchRawFile(url) {
  const headers = {
    "User-Agent": "GitTutorial-App",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) return null;

  return res.text();
}

// Parse repo URL
function parseRepoUrl(repoUrl) {
  if (!repoUrl) throw new Error("Invalid GitHub repo URL");

  repoUrl = repoUrl.split("?")[0].split("#")[0].replace(/\.git$/, "");

  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL. Use https://github.com/user/repo");

  return { owner: match[1], repo: match[2] };
}

// Main function
async function fetchFilesFromGitHub(repoUrl) {
  try {
    const { owner, repo } = parseRepoUrl(repoUrl);

    // BACKOFF to reduce API spam
    await delay(300);

    // Repo metadata
    const repoMeta = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const defaultBranch = repoMeta.default_branch || "main";

    // Tree fetch
    const treeData = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
    );

    if (!treeData.tree) throw new Error("Repository file tree not found.");

    const codeFiles = treeData.tree.filter(
      (file) =>
        file.type === "blob" &&
        isCodeFile(file.path) &&
        file.size <= maxFileSize
    );

    const prioritized = prioritizeFiles(codeFiles);

    let combinedContent = "";

    for (const file of prioritized) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`;

      // Retry mechanism
      let retries = 3;
      let content = null;

      while (retries > 0 && content === null) {
        try {
          content = await fetchRawFile(rawUrl);
        } catch {
          await delay(300);
        }
        retries--;
      }

      if (!content) continue;

      const entry = `\n--- FILE: ${file.path} ---\n${sanitizeContent(
        content
      )}\n`;

      if (combinedContent.length + entry.length > maxTotalLength) break;

      combinedContent += entry;
      await delay(150); // slight delay per file to avoid rate-limit bursts
    }

    return combinedContent || "No valid files found.";
  } catch (err) {
    console.error("GitHub fetch error:", err.message);
    throw err;
  }
}

export { fetchFilesFromGitHub as fetchGitContent };