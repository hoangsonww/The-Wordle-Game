import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

export default function Timer({ isRunning, onTimeUpdate }: TimerProps) {
  const { showTimer } = useSettingsStore();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  if (!showTimer) return null;

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
      <Clock size={20} />
      <span className="font-mono font-bold text-lg">
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}
