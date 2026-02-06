import { Share2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShareButtonProps {
  gameName: string;
  score: string;
  shareText: string;
}

export default function ShareButton({
  gameName,
  score,
  shareText,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `${gameName} - Score: ${score}\n${shareText}\n\nPlay at: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${gameName} Result`,
          text,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(text);
        }
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
    >
      {copied ? <Check size={20} /> : <Share2 size={20} />}
      {copied ? "Copied!" : "Share Results"}
    </button>
  );
}
