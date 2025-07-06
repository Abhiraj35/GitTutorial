import { useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function TutorialInput({
  setTutorial,
  setLoading,
  loading,
  setRequested,
  setError,
}) {
  const [repoUrl, setRepoUrl] = useState("");

  function isValidGitHubUrl(url) {
    return /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/.test(url.trim());
  }

  async function generateTutorial() {
    if (!isValidGitHubUrl(repoUrl)) {
      alert("❗ Please enter a valid GitHub repository URL.");
      return;
    }
    setError(false);
    setRequested(true);
    setLoading(true);
    setTutorial("");

    try {
      const res = await fetch("https://gitdocify.vercel.app/api/tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });
       if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to fetch tutorial.");
      }
      const data = await res.json();
      setTutorial(data);
    } catch (err) {
      setError("Failed to generate tutorial. Please check the repo URL.");
      
    } finally {
      setLoading(false);
    }
  }

  const handleKeypress = async (event) => {
    //here we are looking for the key whether it is "enter key" or not
    if(event.code === 'Enter'){
      await generateTutorial();
    }
  }
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
      <input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        onKeyDown={handleKeypress}
        placeholder="Enter GitHub repo URL"
        className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={generateTutorial}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
      >
        <FaGithub />
        {loading ? "Generating..." : "Generate Tutorial"}
      </button>
    </div>
  );
}
