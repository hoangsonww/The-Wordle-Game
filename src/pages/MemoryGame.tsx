import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStatsStore } from "../store/statsStore";
import { RefreshCw, Brain } from "lucide-react";

interface MemoryPuzzleResponse {
  pairs: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface Card {
  id: string;
  value: string;
  revealed: boolean;
  matched: boolean;
}

function shuffleCards<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoryGame() {
  const { recordMemoryGame, recordMemoryStart } = useStatsStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const lockRef = useRef(false);
  const startRef = useRef(0);

  const totalPairs = cards.length / 2;

  const loadPuzzle = () => {
    setLoading(true);
    setError("");
    setGameWon(false);
    setMoves(0);
    setMatches(0);
    setSelected([]);
    lockRef.current = false;

    fetch("https://wordle-game-backend.vercel.app/api/memory/puzzle")
      .then((res) => res.json())
      .then((data: MemoryPuzzleResponse) => {
        const deck = data.pairs.flatMap((value, idx) => [
          { id: `${value}-${idx}-a`, value, revealed: false, matched: false },
          { id: `${value}-${idx}-b`, value, revealed: false, matched: false },
        ]);
        setCards(shuffleCards(deck));
        recordMemoryStart();
        startRef.current = Date.now();
        setElapsed(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching memory puzzle:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPuzzle();
  }, []);

  useEffect(() => {
    if (loading || gameWon) return;
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [loading, gameWon]);

  useEffect(() => {
    if (selected.length !== 2 || gameWon) return;

    const [firstIdx, secondIdx] = selected;
    const firstCard = cards[firstIdx];
    const secondCard = cards[secondIdx];

    if (!firstCard || !secondCard) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);

    if (firstCard.value === secondCard.value) {
      const updated = cards.map((card, idx) =>
        idx === firstIdx || idx === secondIdx
          ? { ...card, matched: true, revealed: true }
          : card,
      );
      const nextMatches = matches + 1;
      setCards(updated);
      setMatches(nextMatches);
      setSelected([]);

      if (nextMatches === totalPairs) {
        const finalTime = Math.max(
          1,
          Math.floor((Date.now() - startRef.current) / 1000),
        );
        setGameWon(true);
        recordMemoryGame(true, nextMoves, finalTime);
      }
    } else {
      lockRef.current = true;
      window.setTimeout(() => {
        setCards((prev) =>
          prev.map((card, idx) =>
            idx === firstIdx || idx === secondIdx
              ? { ...card, revealed: false }
              : card,
          ),
        );
        setSelected([]);
        lockRef.current = false;
      }, 800);
    }
  }, [selected, cards, moves, matches, totalPairs, gameWon, recordMemoryGame]);

  const handleCardClick = (index: number) => {
    if (loading || gameWon || lockRef.current) return;
    if (selected.length >= 2) return;
    if (selected.includes(index)) return;

    const card = cards[index];
    if (!card || card.matched || card.revealed) return;

    setCards((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, revealed: true } : c)),
    );
    setSelected((prev) => [...prev, index]);
  };

  const gridColumns = totalPairs <= 6 ? 4 : totalPairs <= 8 ? 4 : 5;

  if (loading) {
    return (
      <Layout title="Memory Match">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Memory Match">
        <div className="flex justify-center items-center h-96">
          <div className="bg-red-500/20 p-6 rounded-lg text-white">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (gameWon) {
    return (
      <Layout title="Memory Match">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">Perfect Recall!</h2>
            <p className="text-xl mb-2">
              You cleared the board in {moves} move{moves !== 1 ? "s" : ""}.
            </p>
            <p className="text-lg mb-6 text-white">Time: {elapsed}s</p>
            <button
              onClick={loadPuzzle}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Memory Match">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="text-orange-300" size={28} />
            <p className="text-lg text-white">
              Flip cards and match pairs to clear the board.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white mt-4">
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Moves: {moves}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Matches: {matches}/{totalPairs}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Time: {elapsed}s
            </span>
            <button
              onClick={loadPuzzle}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              Shuffle
            </button>
          </div>
        </div>

        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card, idx) => {
            const isRevealed = card.revealed || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`relative aspect-square rounded-2xl border-2 transition-all shadow-lg text-center text-sm sm:text-base md:text-lg font-bold
                  ${
                    isRevealed
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-orange-500/20 border-orange-400/30 hover:bg-orange-500/30"
                  }
                  ${card.matched ? "ring-2 ring-orange-300" : ""}
                `}
              >
                <span
                  className={`absolute inset-0 flex items-center justify-center ${isRevealed ? "opacity-100" : "opacity-70"}`}
                >
                  {isRevealed ? card.value : "?"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
