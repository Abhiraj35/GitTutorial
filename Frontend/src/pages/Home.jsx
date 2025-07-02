import HeroSection from "../components/HeroSection";
import TutorialInput from "../components/TutorialInput";
import { useState,useEffect } from "react";
import TutorialReader from "../components/TutorialReader";
const Home = () => {
 

  const [tutorial, setTutorial] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

   useEffect(() => {
  if (tutorial && !loading) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}, [tutorial, loading]);
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 px-4 md:px-8">
      <HeroSection />
      <TutorialInput
        setTutorial={setTutorial}
        setLoading={setLoading}
        loading={loading}
        setRequested={setRequested}
      />
      <TutorialReader tutorial={tutorial}/>
    </main>
  );
};

export default Home;
