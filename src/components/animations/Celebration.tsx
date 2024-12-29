import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface CelebrationProps {
  message: string;
}

const Celebration = ({ message }: CelebrationProps) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onAnimationComplete={triggerConfetti}
      className="text-center p-6"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.5, repeat: 3 }}
        className="text-4xl mb-4"
      >
        🎉
      </motion.div>
      <p className="text-xl font-bold text-primary">{message}</p>
    </motion.div>
  );
};

export default Celebration;
