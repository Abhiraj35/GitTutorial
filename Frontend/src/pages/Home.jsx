import HeroSection from "../components/HeroSection";
import TutorialInput from "../components/TutorialInput";
import { useState,useEffect } from "react";
import { AlertCircle } from "lucide-react";
import TutorialReader from "../components/TutorialReader";
import ModernLoadingAnimation from "../components/ModernLoadingAnimation";

const Home = () => {
 

  const [tutorial, setTutorial] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error,setError] = useState(null); 

   useEffect(() => {
  if (tutorial && !loading) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}, [tutorial, loading]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-900 px-4 md:px-8 ">
      <HeroSection />
      <TutorialInput
        setTutorial={setTutorial}
        setLoading={setLoading}
        loading={loading}
        setRequested={setRequested}
        setError={setError}
      />
      {/* 🔄 LOADING */}
      {loading && (
        <ModernLoadingAnimation
          title="Analyzing Repository"
          subtitle="Hang tight while we generate a personalized tutorial..."
          variant="github"
        />
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-300 rounded flex items-center justify-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* NO TUTORIAL YET */}
      {!loading && requested && !tutorial && !error && (
        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 text-center rounded">
          No tutorial found for this repository. Please try again with a valid repo.
        </div>
      )}

      {/* TUTORIAL READY */}
      {!loading && tutorial && (
        <TutorialReader tutorial={tutorial} />
      )}
    </main>
  );
};

export default Home;
