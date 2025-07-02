import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.section 
      className="text-center py-12 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Transform GitHub Repos into <span className="text-blue-600">SEO-Friendly Tutorials</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Instantly convert GitHub repositories into beautiful, structured guides using AI.
      </p>
    </motion.section>
  );
}
