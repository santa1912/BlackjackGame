import { useState } from "react";
import Card from "./components/Card";

export default function App() {
  const suits = ["♠", "♥", "♦", "♣"];

  const drawCard = () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * 4)],
  });

  const getScore = (cards) => {
    return cards.reduce((sum, c) => {
      if (c.value > 10) return sum + 10;
      return sum + c.value;
    }, 0);
  };

  const [player, setPlayer] = useState([drawCard(), drawCard()]);
  const [computer, setComputer] = useState([drawCard(), drawCard()]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const hit = () => {
    const newPlayer = [...player, drawCard()];
    setPlayer(newPlayer);

    if (getScore(newPlayer) > 21) {
      setWinner("Computer");
      setGameOver(true);
    }
  };

  const stand = () => {
    let comp = [...computer];

    while (getScore(comp) < 17) {
      comp.push(drawCard());
    }

    setComputer(comp);

    const ps = getScore(player);
    const cs = getScore(comp);

    if (ps > 21) setWinner("Computer");
    else if (cs > 21) setWinner("You");
    else if (ps > cs) setWinner("You");
    else if (cs > ps) setWinner("Computer");
    else setWinner("Draw");

    setGameOver(true);
  };

  const reset = () => {
    setPlayer([drawCard(), drawCard()]);
    setComputer([drawCard(), drawCard()]);
    setWinner("");
    setGameOver(false);
  };

  return (
  <div className="min-h-screen bg-green-300 flex items-center justify-center">

    {/* กล่องใหญ่กลางจอ */}
    <div className="bg-green-700 p-8 rounded-2xl shadow-2xl text-center w-[400px]">

      <h1 className="text-3xl font-bold text-white mb-6">
        ♠ Blackjack ♦
      </h1>

      {/* Player Box */}
      <div className="bg-green-500 p-4 rounded-xl mb-6">
        <h2 className="text-white">Your Cards</h2>
        <p className="text-white mb-2">
          Total: {getScore(player)}
        </p>

        <div className="flex justify-center gap-2">
          {player.map((c, i) => (
            <Card key={i} card={c} />
          ))}
        </div>
      </div>

      {/* Computer Box */}
      <div className="bg-green-500 p-4 rounded-xl mb-6">
        <h2 className="text-white">Computer Cards</h2>
        <p className="text-white mb-2">
          Total: {getScore(computer)}
        </p>

        <div className="flex justify-center gap-2">
          {computer.map((c, i) => (
            <Card key={i} card={c} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      {!gameOver ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={hit}
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            Hit
          </button>
          <button
            onClick={stand}
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            Stand
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-white mb-4">
            Winner: {winner}
          </h2>
          <button
            onClick={reset}
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  </div>
  );
}