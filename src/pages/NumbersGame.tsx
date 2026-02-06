import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Plus, Minus, X, Divide, Undo } from "lucide-react";
import { useStatsStore } from "../store/statsStore";

interface Puzzle {
  numbers: number[];
  target: number;
}

interface Operation {
  num1: number;
  num2: number;
  operator: string;
  result: number;
}

/**
 * NumbersGame component - Use mathematical operations to reach the target number
 */
export default function NumbersGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const startRef = useRef<number>(Date.now());
  const { recordNumbersGame, recordNumbersStart } = useStatsStore();

  useEffect(() => {
    // Fetch puzzle from API
    fetch("https://wordle-game-backend.vercel.app/api/numbers/puzzle")
      .then((res) => res.json())
      .then((data) => {
        setPuzzle(data);
        setAvailableNumbers(data.numbers);
        recordNumbersStart();
        startRef.current = Date.now();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching puzzle:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  }, []);

  const toggleNumber = (num: number) => {
    const alreadySelected = selectedNumbers.includes(num);

    if (alreadySelected) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const performOperation = (operator: string) => {
    if (selectedNumbers.length !== 2) {
      setMessage("Please select exactly 2 numbers");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const [num1, num2] = selectedNumbers;
    let result: number;

    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "×":
        result = num1 * num2;
        break;
      case "÷":
        if (num2 === 0 || num1 % num2 !== 0) {
          setMessage("Division must result in a whole number");
          setTimeout(() => setMessage(""), 2000);
          return;
        }
        result = num1 / num2;
        break;
      default:
        return;
    }

    // Add operation to history
    setOperations([...operations, { num1, num2, operator, result }]);

    // Remove the two selected numbers from available numbers
    const firstIndex = availableNumbers.indexOf(num1);
    const secondIndex = availableNumbers.indexOf(
      num2,
      firstIndex === availableNumbers.lastIndexOf(num1) ? 0 : firstIndex + 1,
    );

    const updatedNumbers = availableNumbers.filter(
      (_, idx) => idx !== firstIndex && idx !== secondIndex,
    );
    setAvailableNumbers([...updatedNumbers, result]);
    setSelectedNumbers([]);

    // Check if target is reached
    if (result === puzzle?.target) {
      setGameWon(true);
      const elapsed = Math.max(
        1,
        Math.floor((Date.now() - startRef.current) / 1000),
      );
      recordNumbersGame(true, operations.length + 1, elapsed);
    }
  };

  const undoLastOperation = () => {
    if (operations.length === 0) return;

    const lastOp = operations[operations.length - 1];
    setOperations(operations.slice(0, -1));

    // Remove result and add back the two numbers
    const newNumbers = availableNumbers.filter((n) => n !== lastOp.result);
    setAvailableNumbers([...newNumbers, lastOp.num1, lastOp.num2]);
    setSelectedNumbers([]);
  };

  if (loading) {
    return (
      <Layout title="Numbers">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Numbers">
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
      <Layout title="Numbers">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">🎯 Target Reached!</h2>
            <p className="text-xl mb-2">
              You reached {puzzle?.target} in {operations.length} move
              {operations.length !== 1 ? "s" : ""}!
            </p>
            <div className="bg-white/10 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold mb-2">Your Solution:</h3>
              {operations.map((op, idx) => (
                <p key={idx} className="text-sm">
                  {op.num1} {op.operator} {op.num2} = {op.result}
                </p>
              ))}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Numbers">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-lg text-white mb-2">
            Use the numbers to reach the target
          </p>
          <div className="text-5xl font-extrabold mb-4 bg-white/20 backdrop-blur-md py-4 px-8 rounded-lg inline-block">
            Target: {puzzle?.target}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-4">
            <p className="text-lg bg-red-500/30 backdrop-blur-md py-2 px-4 rounded-lg inline-block">
              {message}
            </p>
          </div>
        )}

        {/* Available Numbers */}
        <div className="mb-6">
          <h3 className="text-center text-lg font-bold mb-3">
            Available Numbers
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {availableNumbers.map((num, idx) => (
              <button
                key={`${num}-${idx}`}
                onClick={() => toggleNumber(num)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg font-bold text-xl sm:text-2xl transition-all ${
                  selectedNumbers.includes(num)
                    ? "bg-yellow-500 text-white scale-95"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="mb-6">
          <h3 className="text-center text-lg font-bold mb-3">Operations</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => performOperation("+")}
              disabled={selectedNumbers.length !== 2}
              className={`w-14 h-14 rounded-lg font-bold text-2xl transition-all ${
                selectedNumbers.length === 2
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              <Plus className="mx-auto" size={24} />
            </button>
            <button
              onClick={() => performOperation("-")}
              disabled={selectedNumbers.length !== 2}
              className={`w-14 h-14 rounded-lg font-bold text-2xl transition-all ${
                selectedNumbers.length === 2
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              <Minus className="mx-auto" size={24} />
            </button>
            <button
              onClick={() => performOperation("×")}
              disabled={selectedNumbers.length !== 2}
              className={`w-14 h-14 rounded-lg font-bold text-2xl transition-all ${
                selectedNumbers.length === 2
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              <X className="mx-auto" size={24} />
            </button>
            <button
              onClick={() => performOperation("÷")}
              disabled={selectedNumbers.length !== 2}
              className={`w-14 h-14 rounded-lg font-bold text-2xl transition-all ${
                selectedNumbers.length === 2
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              <Divide className="mx-auto" size={24} />
            </button>
          </div>
        </div>

        {/* Undo Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={undoLastOperation}
            disabled={operations.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              operations.length > 0
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-gray-600 text-white cursor-not-allowed"
            }`}
          >
            <Undo size={20} />
            Undo
          </button>
        </div>

        {/* Operation History */}
        {operations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <h3 className="font-bold mb-2 text-center">Your Moves</h3>
            <div className="space-y-1">
              {operations.map((op, idx) => (
                <p key={idx} className="text-center text-sm sm:text-base">
                  {op.num1} {op.operator} {op.num2} = {op.result}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
