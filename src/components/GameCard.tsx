import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

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
export default function GameCard({ title, description, icon: Icon, path, color }: GameCardProps) {
  return (
    <Link
      to={path}
      className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20 hover:border-${color}-400`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`bg-${color}-500/20 p-4 rounded-full`}>
          <Icon size={48} className={`text-${color}-300`} />
        </div>
        <h2 className="text-3xl font-extrabold">{title}</h2>
        <p className="text-gray-200">{description}</p>
        <button className={`bg-${color}-500 hover:bg-${color}-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg mt-4`}>
          Play Now
        </button>
      </div>
    </Link>
  );
}
