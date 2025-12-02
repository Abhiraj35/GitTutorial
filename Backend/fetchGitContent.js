import fetch from "node-fetch";
import dotenv from 'dotenv'
dotenv.config();

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
    const aScore = priority.findIndex((p) => a.path.toLowerCase().endsWith(p));
    const bScore = priority.findIndex((p) => b.path.toLowerCase().endsWith(p));
    return (
      (aScore === -1 ? Infinity : aScore) - (bScore === -1 ? Infinity : bScore)
    );
  });
}

async function fetchWithAuth(url){
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}`} : {};

  const res = await fetch(url,{headers});

  if(!res.ok){
    throw new Error(`Github API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

function parseRepoUrl(repoUrl) {
  if (!repoUrl) {
    throw new Error("Invalid GitHub repo URL");
  }

  // Remove query params and # fragments
  repoUrl = repoUrl.split("?")[0].split("#")[0];

  // Remove trailing .git
  repoUrl = repoUrl.replace(/\.git$/, "");

  // Match basic GitHub URL structure
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match || !match[1] || !match[2]) {
    throw new Error("Invalid GitHub repo URL. Use: https://github.com/user/repo");
  }

  const owner = match[1];
  const repo = match[2];

  return { owner, repo };
}

async function fetchFilesFromGitHub(repoUrl) {
  try {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const repoMeta = await fetchWithAuth(`https://api.github.com/repos/${owner}/${repo}`);
    const defaultBranch = repoMeta.default_branch || "main";

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

    const fetchFileContent = async (file) => {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`;
      const res = await fetch(rawUrl);
      if (!res.ok) return null;

      const content = await res.text();
      const entry = `\n--- FILE: ${file.path} ---\n${sanitizeContent(content)}\n`;

      return entry;
    };

    for (const file of prioritized) {
      const entry = await fetchFileContent(file);
      if (!entry) continue;

      if (combinedContent.length + entry.length > maxTotalLength) break;
      combinedContent += entry;
    }

    return combinedContent || "No valid files found.";
  } catch (err) {
    console.error("GitHub fetch error:", err.message);
    throw err;
  }
}

export { fetchFilesFromGitHub as fetchGitContent };
