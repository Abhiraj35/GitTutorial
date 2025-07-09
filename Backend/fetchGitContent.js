import fetch from "node-fetch";

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

function isCodeFile(filePath) {
  return allowedExtensions.includes(
    filePath.substring(filePath.lastIndexOf(".")).toLowerCase()
  );
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

async function fetchFilesFromGitHub(repoUrl) {
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match || !match[1] || !match[2]) {
      throw new Error(
        "Invalid GitHub repo URL. Use format: https://github.com/user/repo"
      );
    }

    const owner = match[1];
    const repo = match[2];
    const repoMetaRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const repoMeta = await repoMetaRes.json();
    const defaultBranch = repoMeta.default_branch || "main";

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.tree) throw new Error("Failed to fetch repo tree");

    const codeFiles = data.tree.filter(
      (file) =>
        file.type === "blob" &&
        isCodeFile(file.path) &&
        file.size <= maxFileSize
    );

    const prioritized = prioritizeFiles(codeFiles);

    let combinedContent = "";

    for (const file of prioritized) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`;
      const response = await fetch(rawUrl);
      const content = await response.text();

      const entry = `\n--- FILE: ${file.path} ---\n${sanitizeContent(
        content
      )}\n`;

      if (combinedContent.length + entry.length > maxTotalLength) break;
      combinedContent += entry;
    }

    return combinedContent || "No valid files found.";
  } catch (err) {
    console.error("Failed to fetch repo via GitHub API:", err.message);
    throw err;
  }
}

export { fetchFilesFromGitHub as fetchGitContent };
