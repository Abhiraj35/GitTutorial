import { motion } from "framer-motion";

export default function HeroSection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="text-center py-12 max-w-3xl mx-auto"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
        Turn any GitHub repo into a chapter-wise tutorial
      </h1>
      <p className="text-xl text-gray-300 mb-8 text-balance">
        Learn from real projects, one step at a time — powered by AI
      </p>
    </motion.section>
  );
}
