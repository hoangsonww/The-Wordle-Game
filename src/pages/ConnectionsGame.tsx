import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStatsStore } from "../store/statsStore";

interface Group {
  category: string;
  words: string[];
  difficulty: "easy" | "medium" | "hard" | "tricky";
  color: string;
}

/**
 * ConnectionsGame component - Find groups of four items that share something in common
 */
export default function ConnectionsGame() {
  const [puzzle, setPuzzle] = useState<Group[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const startRef = useRef<number>(Date.now());
  const { recordConnectionsGame, recordConnectionsStart } = useStatsStore();

  const MAX_MISTAKES = 4;

  useEffect(() => {
    // Fetch puzzle from API
    fetch("https://wordle-game-backend.vercel.app/api/connections/puzzle")
      .then((res) => res.json())
      .then((data) => {
        setPuzzle(data.groups);
        const allWords = data.groups.flatMap((g: Group) => g.words);
        // Shuffle words
        setRemainingWords(allWords.sort(() => Math.random() - 0.5));
        recordConnectionsStart();
        startRef.current = Date.now();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching puzzle:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  }, []);

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const deselectAll = () => {
    setSelectedWords([]);
  };

  const shuffleWords = () => {
    setRemainingWords([...remainingWords].sort(() => Math.random() - 0.5));
  };

  const submitGuess = () => {
    if (selectedWords.length !== 4 || !puzzle) {
      setMessage("Please select exactly 4 words");
      return;
    }

    // Check if the selected words form a correct group
    const correctGroup = puzzle.find((group) => {
      const groupWords = group.words;
      return selectedWords.every((word) => groupWords.includes(word));
    });

    if (correctGroup) {
      // Correct guess!
      setMessage(`Correct! ${correctGroup.category}`);
      setSolvedGroups([...solvedGroups, correctGroup]);
      setRemainingWords(
        remainingWords.filter((w) => !selectedWords.includes(w)),
      );
      setSelectedWords([]);

      // Check if all groups are solved
      if (solvedGroups.length + 1 === puzzle.length) {
        setGameWon(true);
        const elapsed = Math.max(
          1,
          Math.floor((Date.now() - startRef.current) / 1000),
        );
        recordConnectionsGame(true, mistakes, elapsed);
      }
    } else {
      // Wrong guess
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      // Check if one away
      let oneAway = false;
      for (const group of puzzle) {
        const matchCount = selectedWords.filter((w) =>
          group.words.includes(w),
        ).length;
        if (matchCount === 3) {
          oneAway = true;
          break;
        }
      }

      if (oneAway) {
        setMessage("One away...");
      } else {
        setMessage("Incorrect. Try again!");
      }

      setSelectedWords([]);

      // Check if game over
      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
        const elapsed = Math.max(
          1,
          Math.floor((Date.now() - startRef.current) / 1000),
        );
        recordConnectionsGame(false, newMistakes, elapsed);
      }
    }

    // Clear message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-lime-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-orange-500";
      case "tricky":
        return "bg-purple-600";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <Layout title="Connections">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Connections">
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
      <Layout title="Connections">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-xl mb-6">
              You found all the connections with {mistakes} mistake
              {mistakes !== 1 ? "s" : ""}!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (gameOver) {
    return (
      <Layout title="Connections">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">😔 Game Over</h2>
            <p className="text-xl mb-6">
              You've used all {MAX_MISTAKES} mistakes. Better luck next time!
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">
                The correct groups were:
              </h3>
              {puzzle?.map((group, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-semibold">{group.category}</p>
                  <p className="text-sm text-white">{group.words.join(", ")}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Connections">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-lg text-white mb-2">
            Find groups of four items that share something in common
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              Mistakes: {mistakes}/{MAX_MISTAKES}
              <div className="flex gap-1 mt-1">
                {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < mistakes ? "bg-red-500" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-4">
            <p className="text-xl font-bold bg-white/20 backdrop-blur-md py-2 px-4 rounded-lg inline-block">
              {message}
            </p>
          </div>
        )}

        {/* Solved Groups */}
        {solvedGroups.map((group, idx) => (
          <div
            key={idx}
            className={`${getDifficultyColor(group.difficulty)} rounded-lg p-4 mb-3 text-center`}
          >
            <p className="font-bold text-lg mb-2">{group.category}</p>
            <p className="text-white">{group.words.join(", ")}</p>
          </div>
        ))}

        {/* Word Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {remainingWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => toggleWord(word)}
              className={`p-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                selectedWords.includes(word)
                  ? "bg-gray-700 text-white scale-95"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={shuffleWords}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            Shuffle
          </button>
          <button
            onClick={deselectAll}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            Deselect All
          </button>
          <button
            onClick={submitGuess}
            disabled={selectedWords.length !== 4}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              selectedWords.length === 4
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-600 text-white cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
}
