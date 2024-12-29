import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EMOTIONS, type EmotionType } from "@/types/emotions";

interface EmotionPickerProps {
  selected?: EmotionType;
  onSelect: (emotion: EmotionType) => void;
}

const EmotionPicker = ({ selected, onSelect }: EmotionPickerProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Object.entries(EMOTIONS).map(([key, emotion]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(key as EmotionType)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg",
            "transition-colors duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            selected === key
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          )}
        >
          <span className="text-2xl">{emotion.icon}</span>
          <span className="text-sm font-medium">{emotion.type}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default EmotionPicker;
