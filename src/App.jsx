import { useState, useEffect } from "react";
import Card from "./components/Card";

export default function App() {
  const suits = ["♠", "♥", "♦", "♣"];

  const drawCard = () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * 4)],
  });

  // ฟังก์ชันคำนวณแต้ม (A = 1 หรือ 11)
  const getScore = (cards) => {
    let score = 0;
    let hasAce = false;

    cards.forEach((c) => {
      if (c.value > 10) score += 10;
      else if (c.value === 1) {
        hasAce = true;
        score += 1;
      } else {
        score += c.value;
      }
    });

    if (hasAce && score + 10 <= 21) {
      score += 10;
    }
    return score;
  };

  const [player, setPlayer] = useState([drawCard(), drawCard()]);
  const [computer, setComputer] = useState([drawCard(), drawCard()]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  // เช็ค Blackjack (A + 10,J,Q,K) ตั้งแต่เริ่มเกม
  useEffect(() => {
    const pScore = getScore(player);
    const cScore = getScore(computer);

    if (pScore === 21 && player.length === 2) {
      setWinner("Blackjack! You Win ✨");
      setGameOver(true);
    } else if (cScore === 21 && computer.length === 2) {
      setWinner("Computer Blackjack! 💀");
      setGameOver(true);
    }
  }, []);

  const hit = () => {
    if (gameOver) return;
    const newPlayer = [...player, drawCard()];
    setPlayer(newPlayer);

    if (getScore(newPlayer) > 21) {
      setWinner("Bust! Computer Wins");
      setGameOver(true);
    }
  };

  const stand = () => {
    if (gameOver) return;
    let comp = [...computer];

    // Dealer AI: จั่วจนกว่าจะได้อย่างน้อย 17
    while (getScore(comp) < 17) {
      comp.push(drawCard());
    }
    setComputer(comp);

    const ps = getScore(player);
    const cs = getScore(comp);

    if (cs > 21) setWinner("You Win! (Dealer Bust)");
    else if (ps > cs) setWinner("You Win! 🏆");
    else if (cs > ps) setWinner("Computer Wins");
    else setWinner("Draw 🤝");

    setGameOver(true);
  };

  const reset = () => {
    setPlayer([drawCard(), drawCard()]);
    setComputer([drawCard(), drawCard()]);
    setWinner("");
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="bg-green-800 p-8 rounded-3xl shadow-2xl text-center w-full max-w-md border-4 border-yellow-600">
        <h1 className="text-4xl font-black text-white mb-8 tracking-widest drop-shadow-md">
          ♠ BLACKJACK ♦
        </h1>

        {/* Dealer Area */}
        <div className="bg-black/20 p-4 rounded-2xl mb-6">
          <h2 className="text-yellow-400 font-bold mb-2 uppercase tracking-tighter">Dealer's Hand</h2>
          <div className="flex justify-center gap-2 mb-2">
            {computer.map((c, i) => <Card key={i} card={c} />)}
          </div>
          <p className="text-white font-mono">Score: {getScore(computer)}</p>
        </div>

        {/* Player Area */}
        <div className="bg-black/20 p-4 rounded-2xl mb-8">
          <h2 className="text-yellow-400 font-bold mb-2 uppercase tracking-tighter">Your Hand</h2>
          <div className="flex justify-center gap-2 mb-2">
            {player.map((c, i) => <Card key={i} card={c} />)}
          </div>
          <p className="text-white font-mono text-xl">Total: {getScore(player)}</p>
        </div>

        {/* Controls */}
        {!gameOver ? (
          <div className="flex justify-center gap-6">
            <button onClick={hit} className="bg-white text-green-900 font-bold px-8 py-3 rounded-full shadow-xl hover:bg-yellow-400 transition-colors">HIT</button>
            <button onClick={stand} className="bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-xl hover:bg-green-500 border border-white/30 transition-colors">STAND</button>
          </div>
        ) : (
          <div className="animate-bounce-in">
            <h2 className="text-3xl font-black text-yellow-300 mb-4 drop-shadow-lg uppercase">{winner}</h2>
            <button onClick={reset} className="bg-yellow-500 text-black font-black px-10 py-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-all scale-110">PLAY AGAIN</button>
          </div>
        )}
      </div>
    </div>
  );
}