import { useEffect, useState } from "react";
import TileRow from "./TileRow";
import Keyboard from "./Keyboard";
import GameWon from "./GameWon";
import GameOver from "./GameOver";
import toast from "react-hot-toast";

function App() {
  const [targetWord, setTargetWord] = useState<string>("");
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
      })
      .catch((err) => {
        console.error("Error fetching target word:", err);
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
      toast.error("Please enter a 5-letter word");
      return;
    }

    const isValid = await checkGuessValidity(currentGuess);
    if (!isValid) {
      toast.error("Not a valid word. Try again.");
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

  if (gameWon) {
    return <GameWon target={targetWord} />;
  }

  if (gameOver) {
    return <GameOver target={targetWord} />;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <TileRow
            key={i}
            target={targetWord}
            guess={activeRow === i ? currentGuess : pastGuesses[i]}
            guessed={activeRow > i}
          />
        ))}
      </div>
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
  );
}

export default App;
