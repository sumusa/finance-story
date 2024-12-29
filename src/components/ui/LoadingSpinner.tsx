import { motion } from "framer-motion";

const LoadingSpinner = () => {
  const loadingPhrases = [
    "Counting your savings... 💰",
    "Tracking your goals... 🎯",
    "Analyzing your progress... 📊",
    "Preparing your dashboard... ⚡",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-4 text-muted-foreground font-medium"
      >
        {loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
