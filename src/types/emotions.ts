export type EmotionType =
  | "excited"
  | "happy"
  | "neutral"
  | "worried"
  | "stressed";

export interface EmotionData {
  type: EmotionType;
  icon: string;
  color: string;
  description: string;
}

export const EMOTIONS: Record<EmotionType, EmotionData> = {
  excited: {
    type: "excited",
    icon: "🤩",
    color: "bg-green-500",
    description: "Feeling great about this!",
  },
  happy: {
    type: "happy",
    icon: "😊",
    color: "bg-emerald-400",
    description: "Pretty good about this",
  },
  neutral: {
    type: "neutral",
    icon: "😐",
    color: "bg-yellow-400",
    description: "Feeling okay",
  },
  worried: {
    type: "worried",
    icon: "😟",
    color: "bg-orange-400",
    description: "A bit concerned",
  },
  stressed: {
    type: "stressed",
    icon: "😰",
    color: "bg-red-500",
    description: "Very stressed about this",
  },
};
