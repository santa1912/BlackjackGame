import { useState, useEffect } from "react";
import Card from "./components/Card";

export default function App() {
  const suits = ["♠", "♥", "♦", "♣"];

  // --- ฟังก์ชันจัดการเสียง ---
  const playSound = (file) => {
    const audio = new Audio(`/sounds/${file}`);
    audio.play().catch(() => console.log("Audio play blocked"));
  };

  const drawCard = () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * 4)],
  });

  // --- ฟังก์ชันคำนวณแต้ม (A+เลข = 1, A+Face = 21) ---
  const getScore = (cards) => {
    let score = 0;
    let hasAce = false;
    let hasFaceCard = false;

    cards.forEach((c) => {
      if (c.value >= 10) {
        score += 10;
        hasFaceCard = true;
      } else if (c.value === 1) {
        hasAce = true;
        score += 1;
      } else {
        score += c.value;
      }
    });

    // เงื่อนไขพิเศษ: A จะเป็น 11 เฉพาะเมื่อเป็น Blackjack (คู่กับ 10, J, Q, K ใน 2 ใบแรก)
    if (hasAce && hasFaceCard && cards.length === 2 && score + 10 === 21) {
      score += 10;
    }
    return score;
  };

  const [player, setPlayer] = useState([drawCard(), drawCard()]);
  const [computer, setComputer] = useState([drawCard(), drawCard()]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  // ฟังก์ชันเช็คผล Blackjack ตั้งแต่เริ่ม
  const checkInitialResult = (p, c) => {
    const pScore = getScore(p);
    const cScore = getScore(c);

    if (pScore === 21 && p.length === 2) {
      setWinner("Blackjack! You Win ✨");
      setGameOver(true);
      playSound("blackjack.mp3");
    } else if (cScore === 21 && c.length === 2) {
      setWinner("Computer Blackjack! 💀");
      setGameOver(true);
      playSound("lose.mp3");
    }
  };

  useEffect(() => {
    checkInitialResult(player, computer);
  }, []);

  const hit = () => {
    if (gameOver) return;
    playSound("card.mp3");
    const newPlayer = [...player, drawCard()];
    setPlayer(newPlayer);

    if (getScore(newPlayer) > 21) {
      setWinner("Bust! Computer Wins");
      setGameOver(true);
      playSound("lose.mp3");
    }
  };

  const stand = () => {
    if (gameOver) return;
    let comp = [...computer];

    while (getScore(comp) < 17) {
      comp.push(drawCard());
    }
    setComputer(comp);
    playSound("card.mp3");

    const ps = getScore(player);
    const cs = getScore(comp);

    if (cs > 21) {
      setWinner("You Win! (Dealer Bust)");
      playSound("win.mp3");
    } else if (ps > cs) {
      setWinner("You Win! 🏆");
      playSound("win.mp3");
    } else if (cs > ps) {
      setWinner("Computer Wins");
      playSound("lose.mp3");
    } else {
      setWinner("Draw 🤝");
    }
    setGameOver(true);
  };

  const reset = () => {
    const newP = [drawCard(), drawCard()];
    const newC = [drawCard(), drawCard()];
    setPlayer(newP);
    setComputer(newC);
    setWinner("");
    setGameOver(false);
    playSound("card.mp3");
    checkInitialResult(newP, newC); // เช็ค Blackjack ทันทีที่แจกใหม่
  };

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="bg-green-800 p-8 rounded-[2rem] shadow-2xl text-center w-full max-w-md border-4 border-yellow-600/50">
        <h1 className="text-4xl font-black text-white mb-8 tracking-widest drop-shadow-md">
          ♠ BLACKJACK ♦
        </h1>

        {/* Dealer Area */}
        <div className="bg-black/20 p-4 rounded-2xl mb-6 border border-white/5">
          <h2 className="text-yellow-400 font-bold mb-2 uppercase text-xs tracking-widest">Dealer's Hand</h2>
          <div className="flex justify-center gap-2 mb-2">
            {computer.map((c, i) => <Card key={i} card={c} />)}
          </div>
          <p className="text-white font-mono opacity-70">Score: {getScore(computer)}</p>
        </div>

        {/* Player Area */}
        <div className="bg-black/20 p-4 rounded-2xl mb-8 border border-white/5">
          <h2 className="text-yellow-400 font-bold mb-2 uppercase text-xs tracking-widest">Your Hand</h2>
          <div className="flex justify-center gap-2 mb-2">
            {player.map((c, i) => <Card key={i} card={c} />)}
          </div>
          <p className="text-white font-mono text-2xl font-bold">Total: {getScore(player)}</p>
        </div>

        {/* Controls */}
        {!gameOver ? (
          <div className="flex justify-center gap-6">
            <button onClick={hit} className="bg-white text-green-900 font-bold px-10 py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition-all active:scale-95">HIT</button>
            <button onClick={stand} className="bg-green-600 text-white font-bold px-10 py-3 rounded-xl shadow-lg hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 transition-all">STAND</button>
          </div>
        ) : (
          <div className="animate-bounce-in">
            <h2 className="text-3xl font-black text-yellow-300 mb-6 drop-shadow-lg uppercase italic">{winner}</h2>
            <button onClick={reset} className="bg-yellow-500 text-black font-black px-12 py-4 rounded-xl shadow-[0_6px_0_rgb(161,98,7)] hover:shadow-none hover:translate-y-1 transition-all text-xl">PLAY AGAIN</button>
          </div>
        )}
      </div>
    </div>
  );
}