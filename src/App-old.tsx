import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import TileRow from "./TileRow";
import Keyboard from "./Keyboard";
import GameWon from "./GameWon";
import GameOver from "./GameOver";

/**
 * App component is the main component of the Wordle game.
 * It handles the game logic, including fetching the target word,
 * managing guesses, and determining if the game is won or lost.
 *
 * @returns - a div element representing the main game screen
 */
export default function App() {
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
      // Convert the response to JSON
      .then((res) => res.json())
      // Extract the word from the JSON and set it as the target word
      .then((data) => {
        setTargetWord(data.word);
      })
      // Catch any errors and log them to the console
      .catch((err) => {
        console.error("Error fetching target word:", err);
      });
  }, []);

  /**
   * This function handles the key press event when a letter is pressed on the keyboard.
   * It adds the letter to the current guess if the guess is less than 5 letters long.
   *
   * @param letter - The letter to add to the current guess.
   * @returns - void
   */
  const onKeyPress = (letter: string) => {
    // Validation to not allow more than 5 letters
    if (currentGuess.length >= 5) {
      return;
    }

    // Add the letter to the current guess
    setCurrentGuess((oldGuess) => oldGuess + letter);
  };

  /**
   * This function handles the backspace event when the backspace key is pressed.
   * It removes the last letter from the current guess.
   *
   * @returns - void
   */
  const onBackspace = () => {
    // Validation to not allow backspacing when there's no letters
    if (currentGuess.length === 0) {
      return;
    }

    // Remove the last letter from the current guess
    setCurrentGuess((oldGuess) => oldGuess.slice(0, -1));
  };

  /**
   * This function checks if the current guess is a valid word by making a request to the API.
   * It returns a boolean indicating if the guess is valid.
   *
   * @param guess - The guess to check for validity.
   * @returns - A promise that resolves to a boolean indicating if the guess is valid.
   */
  const checkGuessValidity = async (guess: string) => {
    try {
      // First, fetch the validity of the guess from the API
      const res = await fetch(
        `https://wordle-game-backend.vercel.app/api/word-valid/${guess.toLowerCase()}`,
      );

      // Convert the response to JSON and extract the validity
      const data = await res.json();
      return data.valid;
    } catch (err) {
      console.error("Error checking guess validity: ", err);
      // Just in case there's an error, treat it as invalid for safety
      return false;
    }
  };

  /**
   * This function handles the guess submission when the user presses Enter.
   * It checks if the guess is valid, updates the past guesses, and checks if the game is won or lost.
   *
   * @returns - void
   */
  const makeGuess = async () => {
    // 1. Check that the guess has 5 letters.
    if (currentGuess.length < 5) {
      alert("Please enter a 5-letter word");
      return; // Stop if it's too short
    }

    // 2. Ask the API if the guess is a valid dictionary word.
    const isValid = await checkGuessValidity(currentGuess);
    if (!isValid) {
      alert(
        "This is not a valid word. Please delete your current guess and try again.",
      );
      return; // Stop the function immediately if it isn't valid
    }

    // 3. "Lock in" (store) the guess in the array of pastGuesses
    // 3.1 Create a copy of the existing guesses array
    const newGuesses = pastGuesses.slice();
    // 3.2 Put the current guess at the position of the active row
    newGuesses[activeRow] = currentGuess;
    // 3.3 Update state with our new array
    setPastGuesses(newGuesses);

    // 3.4 Preserve our guess and row index for later checks
    const guessUsed = currentGuess;
    const rowUsed = activeRow;

    // 3.5 Clear out the current guess and move on to the next row since the previous guess is valid
    setCurrentGuess("");
    setActiveRow(activeRow + 1);

    // 4 & 5. After a short delay, check if the guess is correct or if the game is over.
    setTimeout(() => {
      // If the guess exactly matches the targetWord (case-insensitive)
      // Game won!
      if (guessUsed.toLowerCase() === targetWord.toLowerCase()) {
        setGameWon(true);
        return;
      }

      // If we've just finished row #5, that means we've used all 6 guesses (0 through 5)
      // Game over!
      if (rowUsed >= 5) {
        setGameOver(true);
      }
    }, 100);
  };

  useEffect(() => {
    // Define a function to handle key presses on the entire window
    function handleKeyDown(e: KeyboardEvent) {
      // If the game is already finished, ignore any new key presses
      if (gameWon || gameOver) {
        return;
      }

      // If the user hits Enter, try making a guess
      if (e.key === "Enter") {
        makeGuess();
      }
      // If the user hits Backspace, remove a letter from the current guess
      else if (e.key === "Backspace") {
        onBackspace();
      }
      // Otherwise, check if it's a single character (like 'A', 'b', etc.)
      else if (e.key.length === 1) {
        // Convert to uppercase for consistency
        const letter = e.key.toUpperCase();
        // Check if it's between 'A' and 'Z'
        if (letter >= "A" && letter <= "Z") {
          onKeyPress(letter);
        }
      }
    }

    // Add the event listener when this component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener if this component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    /**
     * A note about the dependencies array:
     *
     * - gameWon: If the game is won, we stop processing new key events.
     * - gameOver: If the game is lost, we stop processing new key events.
     * - currentGuess: The current guess affects typing behavior, so we need
     *   to ensure that new letters are appended correctly.
     * - activeRow: This determines which row is currently being guessed and
     *   needs to be updated when a new guess is made.
     * - makeGuess: This function is needed when the "Enter" key is pressed
     *   to validate and submit a guess.
     * - onBackspace: This function is used when the "Backspace" key is pressed
     *   to remove the last character from the current guess.
     * - onKeyPress: This function is used to handle letter key presses.
     *
     * Since these dependencies are functions & state values, React ensures that
     * the latest versions of these values are used when the useEffect runs. Without
     * these dependencies, the effect might run with outdated values, which can lead to
     * incorrect game behavior.
     */
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
    <>
      <Analytics />
      {/* gradient animation */}
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #facc15);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }
      `}</style>

      <div className="gradient-bg w-full h-screen flex flex-col justify-between items-center text-white">
        {/* Main Heading & Subheading */}
        <div className="w-full text-center py-4 bg-transparent">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            The Wordle Game
          </h1>
          <h2 className="mt-1 text-xl text-gray-200">
            Can you guess the hidden word in 6 tries?
          </h2>
        </div>

        {/* Game Board on same gradient */}
        <div className="w-full flex flex-col items-center justify-center gap-2 p-6 gradient-bg rounded-xl shadow-2xl max-w-md">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TileRow
              key={i}
              target={targetWord}
              guess={activeRow === i ? currentGuess : pastGuesses[i]}
              guessed={activeRow > i}
            />
          ))}
        </div>

        {/* Keyboard on same gradient */}
        <div className="w-full my-12 flex justify-center p-4 bg-transparent rounded-xl shadow-none max-w-md">
          <Keyboard
            target={targetWord}
            guesses={pastGuesses}
            onKeyPress={onKeyPress}
            onEnter={makeGuess}
            onBackspace={onBackspace}
          />
        </div>
      </div>
    </>
  );
}
