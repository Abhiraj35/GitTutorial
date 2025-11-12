import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import RepoInput from "../components/RepoInput";
import TutorialCard from "../components/TutorialCard";
import TutorialReader from "../components/TutorialReader";
import ModernLoadingAnimation from "../components/ModernLoadingAnimation";

const exampleRepos = [
  {
    name: "React",
    description: "A JavaScript library for building user interfaces with components",
    stars: "200k",
    url: "https://github.com/facebook/react",
  },
  {
    name: "Next.js",
    description: "The React Framework for Production with built-in optimization",
    stars: "120k",
    url: "https://github.com/vercel/next.js",
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapidly building custom designs",
    stars: "80k",
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
];

const Home = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [tutorial, setTutorial] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tutorial && !loading) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [tutorial, loading]);

  async function generateTutorial(url) {
    setError(null);
    setRequested(true);
    setLoading(true);
    setTutorial("");

    try {
      const res = await fetch("https://gitdocify.vercel.app/api/tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url.trim() }),
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

  const handleExampleClick = (url) => {
    setRepoUrl(url);
    generateTutorial(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col z-10 relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-3xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <HeroSection />
          </motion.div>

          {/* Input Section */}
          <motion.div className="mb-16" variants={itemVariants}>
            <RepoInput
              value={repoUrl}
              onChange={setRepoUrl}
              onSubmit={generateTutorial}
              loading={loading}
            />
          </motion.div>

          {/* Example Cards */}
          {!tutorial && !loading && (
            <motion.div variants={itemVariants}>
              <p className="text-sm text-gray-400 mb-6 text-center">
                Try with these popular repositories
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exampleRepos.map((repo, index) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <TutorialCard repo={repo} onClick={handleExampleClick} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12">
            <ModernLoadingAnimation
              title="Analyzing Repository"
              subtitle="Hang tight while we generate a personalized tutorial..."
              variant="github"
            />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-8 max-w-3xl w-full p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center justify-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* No Tutorial Yet */}
        {!loading && requested && !tutorial && !error && (
          <div className="mt-8 max-w-3xl w-full p-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-300 text-center rounded-lg">
            No tutorial found for this repository. Please try again with a valid repo.
          </div>
        )}

        {/* Tutorial Ready */}
        {!loading && tutorial && (
          <div className="mt-12 w-full">
            <TutorialReader tutorial={tutorial} />
          </div>
        )}
      </main>

      {!tutorial && <Footer />}
    </div>
  );
};

export default Home;
