import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent";
}

const StatsCard = ({
  title,
  value,
  icon,
  variant = "default",
}: StatsCardProps) => {
  const variants = {
    default: "bg-card text-card-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className={cn(
          "shadow-lg hover:shadow-xl transition-shadow",
          variants[variant]
        )}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {icon && (
              <div className="p-2 rounded-full bg-background/10">{icon}</div>
            )}
            <p className="text-sm font-medium uppercase tracking-wider">
              {title}
            </p>
          </div>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
