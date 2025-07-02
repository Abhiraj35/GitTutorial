import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { rimraf } from "rimraf";

const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".json", ".md", ".txt", ".py", ".java", ".ejs"];
const maxFileSize = 40 * 1024; // 40KB
const maxTotalLength = 100000;

function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(ext);
}

function sanitizeContent(str) {
  return str
    .replace(/```/g, "") 
    .replace(/\r/g, "")
    .replace(/\t/g, "  ")
    .trim();
}

function readFiles(root, allFiles = []) {
  const items = fs.readdirSync(root);
  for (const item of items) {
    const fullPath = path.join(root, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (["node_modules", ".git", "dist", "build", ".next", ".vscode", "__pycache__"].includes(item)) continue;
      readFiles(fullPath, allFiles);
    } else if (isCodeFile(fullPath) && stat.size <= maxFileSize) {
      const relPath = path.relative(root, fullPath); // 🛠 FIX: should be root
      const content = fs.readFileSync(fullPath, "utf-8");
      allFiles.push({ path: fullPath, relPath, content });
    }
  }
  return allFiles;
}

function prioritizeFiles(files) {
  const priority = [
    "readme.md", "readme.txt", "index.js", "main.js", "main.py", "app.js", ".env.example"
  ];

  return files.sort((a, b) => {
    const aScore = priority.findIndex(p => a.relPath.toLowerCase().endsWith(p));
    const bScore = priority.findIndex(p => b.relPath.toLowerCase().endsWith(p));
    return (aScore === -1 ? Infinity : aScore) - (bScore === -1 ? Infinity : bScore);
  });
}

async function fetchGitContent(repoUrl) {
  const tempDir = path.join(os.tmpdir(), `repo_${Date.now()}`);
  fs.mkdirSync(tempDir);

  try {
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: "ignore" });

    let files = readFiles(tempDir);
    files = prioritizeFiles(files);

    let combinedContent = "";
    for (const file of files) {
      const entry = `\n--- FILE: ${file.relPath} ---\n${sanitizeContent(file.content)}\n`;
      if (combinedContent.length + entry.length > maxTotalLength) break;
      combinedContent += entry;
    }

    return combinedContent || "No valid project files found.";
  } catch (err) {
    console.error("❌ Failed to fetch repo:", err.message);
    throw err;
  } finally {
    await rimraf.rimraf(tempDir);
  }
}

export { fetchGitContent };
