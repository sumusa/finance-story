import { motion } from "framer-motion";
import { EMOTIONS, EmotionType } from "@/types/emotions";

interface MoneyAnimationProps {
  amount: number;
  type: "income" | "expense" | "saving";
  emotion: EmotionType;
}

const MoneyAnimation = ({ amount, type, emotion }: MoneyAnimationProps) => {
  const isPositive = type === "income" || type === "saving";

  return (
    <div className="relative h-40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: isPositive ? -20 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={`
          text-4xl font-bold
          ${isPositive ? "text-green-500" : "text-red-500"}
        `}
      >
        {isPositive ? "+" : "-"}${Math.abs(amount).toLocaleString()}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 right-0 text-2xl"
      >
        {EMOTIONS[emotion].icon}
      </motion.div>
    </div>
  );
};

export default MoneyAnimation;
