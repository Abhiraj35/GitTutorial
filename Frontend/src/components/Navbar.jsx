import { motion } from "framer-motion";
import logo from "../assets/favicon.png";

export default function Navbar() {
  return (
    <motion.nav
      className="w-full px-4 py-6 fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="GitTutorial" width={32} height={32} />
          <h2 className="text-2xl font-bold text-white">GitTutorial</h2>
        </div>
      </div>
    </motion.nav>
  );
}
