import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

/**
 * GameCard component displays a clickable card for each game on the home page
 */
export default function GameCard({
  title,
  description,
  icon: Icon,
  path,
  color,
}: GameCardProps) {
  // Map color names to actual Tailwind classes
  const colorMap = {
    lime: {
      bg: "bg-lime-500",
      hover: "hover:bg-lime-600",
      border: "border-lime-400",
      iconBg: "bg-lime-500/20",
      icon: "text-lime-300",
      glow: "shadow-lime-500/50",
    },
    purple: {
      bg: "bg-purple-500",
      hover: "hover:bg-purple-600",
      border: "border-purple-400",
      iconBg: "bg-purple-500/20",
      icon: "text-purple-300",
      glow: "shadow-purple-500/50",
    },
    blue: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      border: "border-blue-400",
      iconBg: "bg-blue-500/20",
      icon: "text-blue-300",
      glow: "shadow-blue-500/50",
    },
    yellow: {
      bg: "bg-yellow-500",
      hover: "hover:bg-yellow-600",
      border: "border-yellow-400",
      iconBg: "bg-yellow-500/20",
      icon: "text-yellow-300",
      glow: "shadow-yellow-500/50",
    },
    orange: {
      bg: "bg-orange-500",
      hover: "hover:bg-orange-600",
      border: "border-orange-400",
      iconBg: "bg-orange-500/20",
      icon: "text-orange-300",
      glow: "shadow-orange-500/50",
    },
    cyan: {
      bg: "bg-cyan-500",
      hover: "hover:bg-cyan-600",
      border: "border-cyan-400",
      iconBg: "bg-cyan-500/20",
      icon: "text-cyan-300",
      glow: "shadow-cyan-500/50",
    },
  };

  const colorClasses =
    colorMap[color as keyof typeof colorMap] || colorMap.lime;

  return (
    <Link to={path} className="block group">
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`relative bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8
          transition-all duration-300 border-2 border-white/20
          hover:border-white/40 hover:bg-white/15 overflow-hidden h-full`}
      >
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
          bg-gradient-to-br from-white via-transparent to-transparent blur-xl`}
        />

        <div className="relative flex flex-col items-center text-center gap-4 h-full">
          {/* Icon */}
          <div
            className={`${colorClasses.iconBg} p-6 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon
              size={56}
              className={`${colorClasses.icon}`}
              strokeWidth={2}
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-white text-sm sm:text-base leading-relaxed flex-1">
            {description}
          </p>

          {/* Play Button */}
          <button
            className={`${colorClasses.bg} ${colorClasses.hover} ${colorClasses.glow}
              text-white px-8 py-3 rounded-xl font-bold
              transition-all shadow-xl mt-4 w-full
              group-hover:shadow-2xl transform group-hover:-translate-y-1`}
          >
            <span className="flex items-center justify-center gap-2">
              Play Now
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
