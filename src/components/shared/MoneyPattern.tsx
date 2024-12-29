import { motion } from "framer-motion";

const MoneyPattern = () => {
  const patterns = ["💰", "💵", "🪙", "💎", "✨"];

  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
      {patterns.map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            repeatType: "reverse",
          }}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default MoneyPattern;
