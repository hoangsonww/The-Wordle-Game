import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import TileRow from "../TileRow";
import Keyboard from "../Keyboard";
import GameWon from "../GameWon";
import GameOver from "../GameOver";

/**
 * WordleGame component is the main Wordle game page.
 * It handles the game logic, including fetching the target word,
 * managing guesses, and determining if the game is won or lost.
 */
export default function WordleGame() {
  const [targetWord, setTargetWord] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pastGuesses, setPastGuesses] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [activeRow, setActiveRow] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    fetch("https://wordle-game-backend.vercel.app/api/random-word")
      .then((res) => res.json())
      .then((data) => {
        setTargetWord(data.word);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching target word:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  }, []);

  const onKeyPress = (letter: string) => {
    if (currentGuess.length >= 5) {
      return;
    }
    setCurrentGuess((oldGuess) => oldGuess + letter);
  };

  const onBackspace = () => {
    if (currentGuess.length === 0) {
      return;
    }
    setCurrentGuess((oldGuess) => oldGuess.slice(0, -1));
  };

  const checkGuessValidity = async (guess: string) => {
    try {
      const res = await fetch(
        `https://wordle-game-backend.vercel.app/api/word-valid/${guess.toLowerCase()}`,
      );
      const data = await res.json();
      return data.valid;
    } catch (err) {
      console.error("Error checking guess validity: ", err);
      return false;
    }
  };

  const makeGuess = async () => {
    if (currentGuess.length < 5) {
      alert("Please enter a 5-letter word");
      return;
    }

    const isValid = await checkGuessValidity(currentGuess);
    if (!isValid) {
      alert(
        "This is not a valid word. Please delete your current guess and try again.",
      );
      return;
    }

    const newGuesses = pastGuesses.slice();
    newGuesses[activeRow] = currentGuess;
    setPastGuesses(newGuesses);

    const guessUsed = currentGuess;
    const rowUsed = activeRow;

    setCurrentGuess("");
    setActiveRow(activeRow + 1);

    setTimeout(() => {
      if (guessUsed.toLowerCase() === targetWord.toLowerCase()) {
        setGameWon(true);
        // Increment win count
        const wins = parseInt(localStorage.getItem("wordle-wins") || "0");
        localStorage.setItem("wordle-wins", String(wins + 1));
        return;
      }

      if (rowUsed >= 5) {
        setGameOver(true);
      }
    }, 100);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameWon || gameOver) {
        return;
      }

      if (e.key === "Enter") {
        makeGuess();
      } else if (e.key === "Backspace") {
        onBackspace();
      } else if (e.key.length === 1) {
        const letter = e.key.toUpperCase();
        if (letter >= "A" && letter <= "Z") {
          onKeyPress(letter);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameWon,
    gameOver,
    currentGuess,
    activeRow,
    makeGuess,
    onBackspace,
    onKeyPress,
  ]);

  if (loading) {
    return (
      <Layout title="Wordle">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Wordle">
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
      <Layout title="Wordle">
        <GameWon target={targetWord} />
      </Layout>
    );
  }

  if (gameOver) {
    return (
      <Layout title="Wordle">
        <GameOver target={targetWord} />
      </Layout>
    );
  }

  return (
    <Layout title="Wordle">
      <div className="w-full flex flex-col justify-center items-center py-8">
        {/* Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-xl text-gray-200">
            Can you guess the hidden word in 6 tries?
          </h2>
        </div>

        {/* Game Board */}
        <div className="w-full flex flex-col items-center justify-center gap-2 p-6 max-w-md mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TileRow
              key={i}
              target={targetWord}
              guess={activeRow === i ? currentGuess : pastGuesses[i]}
              guessed={activeRow > i}
            />
          ))}
        </div>

        {/* Keyboard */}
        <div className="w-full flex justify-center p-4 max-w-md">
          <Keyboard
            target={targetWord}
            guesses={pastGuesses}
            onKeyPress={onKeyPress}
            onEnter={makeGuess}
            onBackspace={onBackspace}
          />
        </div>
      </div>
    </Layout>
  );
}
