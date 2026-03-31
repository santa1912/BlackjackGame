import { useState, useEffect } from "react";
import Card from "./components/Card";

export default function App() {
  const suits = ["♠", "♥", "♦", "♣"];

  // ฟังก์ชันสุ่มไพ่
  const drawCard = () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * 4)],
  });

  // ฟังก์ชันคำนวณแต้ม (Logic: A = 1 หรือ 11)
  const getScore = (cards) => {
    let score = 0;
    let hasAce = false;

    cards.forEach((c) => {
      if (c.value > 10) score += 10; // J, Q, K = 10
      else if (c.value === 1) {
        hasAce = true;
        score += 1;
      } else {
        score += c.value;
      }
    });

    // ถ้ามี Ace และบวกเพิ่ม 10 แล้วไม่เกิน 21 ให้กลายเป็นแต้ม 11 ทันที
    if (hasAce && score + 10 <= 21) {
      score += 10;
    }
    return score;
  };

  const [player, setPlayer] = useState([drawCard(), drawCard()]);
  const [computer, setComputer] = useState([drawCard(), drawCard()]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  // ฟังก์ชันตรวจสอบ Blackjack (A + 10/J/Q/K)
  const checkBlackjack = (p, c) => {
    const pScore = getScore(p);
    const cScore = getScore(c);

    if (pScore === 21 && p.length === 2) {
      setWinner("Blackjack! You Win ✨");
      setGameOver(true);
    } else if (cScore === 21 && c.length === 2) {
      setWinner("Computer Blackjack! 💀");
      setGameOver(true);
    }
  };

  // เช็ค Blackjack เมื่อโหลดครั้งแรก
  useEffect(() => {
    checkBlackjack(player, computer);
  }, []);

  const hit = () => {
    if (gameOver) return;
    const newPlayer = [...player, drawCard()];
    setPlayer(newPlayer);

    if (getScore(newPlayer) > 21) {
      setWinner("Bust! Computer Wins ❌");
      setGameOver(true);
    }
  };

  const stand = () => {
    if (gameOver) return;
    let comp = [...computer];

    // Dealer AI: จั่วจนกว่าจะได้อย่างน้อย 17 แต้ม
    while (getScore(comp) < 17) {
      comp.push(drawCard());
    }
    setComputer(comp);

    const ps = getScore(player);
    const cs = getScore(comp);

    if (cs > 21) setWinner("You Win! (Dealer Bust) 💰");
    else if (ps > cs) setWinner("You Win! 🏆");
    else if (cs > ps) setWinner("Computer Wins 🏠");
    else setWinner("Draw 🤝");

    setGameOver(true);
  };

  const reset = () => {
    const newP = [drawCard(), drawCard()];
    const newC = [drawCard(), drawCard()];
    setPlayer(newP);
    setComputer(newC);
    setWinner("");
    setGameOver(false);
    
    // สำคัญ: ต้องสั่งเช็ค Blackjack ทันทีที่ Reset ไพ่ใหม่
    checkBlackjack(newP, newC);
  };

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-green-800 p-6 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center w-full max-w-lg border-8 border-yellow-700/50">
        
        <h1 className="text-4xl font-black text-white mb-8 tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          ♠ <span className="text-yellow-400">BLACK</span>JACK ♦
        </h1>

        {/* Dealer Area */}
        <div className="bg-black/30 p-5 rounded-3xl mb-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest">Dealer's Hand</h2>
          <div className="flex justify-center gap-3 mb-3">
            {computer.map((c, i) => (
              <div key={i} className="animate-fade-in">
                {/* ถ้ายังไม่จบเกม ให้ปิดไพ่ใบที่สองของเจ้ามือ (Optional) */}
                <Card card={c} />
              </div>
            ))}
          </div>
          <p className="text-yellow-500 font-mono font-bold text-lg">
            {gameOver ? `Score: ${getScore(computer)}` : "Score: ??"}
          </p>
        </div>

        {/* Player Area */}
        <div className="bg-black/30 p-5 rounded-3xl mb-8 backdrop-blur-sm border border-white/10">
          <h2 className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest">Your Hand</h2>
          <div className="flex justify-center gap-3 mb-3">
            {player.map((c, i) => (
              <div key={i} className="animate-fade-in">
                <Card card={c} />
              </div>
            ))}
          </div>
          <p className="text-white font-mono text-2xl font-black">
            Total: <span className="text-yellow-400">{getScore(player)}</span>
          </p>
        </div>

        {/* Action Buttons */}
        {!gameOver ? (
          <div className="flex justify-center gap-4">
            <button 
              onClick={hit} 
              className="group relative bg-white text-green-900 font-black px-10 py-4 rounded-2xl shadow-xl hover:bg-yellow-400 transition-all active:scale-95"
            >
              HIT
            </button>
            <button 
              onClick={stand} 
              className="bg-green-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              STAND
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-yellow-300 drop-shadow-lg uppercase italic tracking-tighter">
              {winner}
            </h2>
            <button 
              onClick={reset} 
              className="bg-yellow-500 text-black font-black px-12 py-5 rounded-2xl shadow-[0_10px_0_rgb(161,98,7)] hover:shadow-none hover:translate-y-1 transition-all text-xl"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}