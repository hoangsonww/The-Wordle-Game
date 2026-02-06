type GameOverProps = { target: string };

/**
 * GameOver component displays a message when the player loses the game.
 * It shows the correct word and a button to play again.
 *
 * @param target - the target word
 * @returns - a div element representing the game over screen
 */
export default function GameOver({ target }: GameOverProps) {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-rose-500">Game Over.</h1>
      <p className="mt-4 text-center text-white">
        Correct word: <strong className="font-bold">{target}</strong>
      </p>
      <div
        className="mt-8 w-36 h-10 bg-slate-400 rounded-lg flex items-center justify-center font-bold cursor-pointer text-white"
        onClick={() => window.location.reload()}
      >
        Play Again
      </div>
    </div>
  );
}
