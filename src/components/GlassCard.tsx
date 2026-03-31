import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { ReactNode, Key } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: Key;
}

export const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300 border border-white/10 hover:border-white/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
