import { useState, useEffect } from "react";
import Card from "./components/Card";

export default function App() {
  const suits = ["♠", "♥", "♦", "♣"];
  
  // --- States สำหรับคุมหน้าจอ ---
  // gameState: 'start' | 'how-to' | 'play'
  const [gameState, setGameState] = useState("start"); 

  const [player, setPlayer] = useState([]);
  const [computer, setComputer] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  // --- ฟังก์ชันจัดการเสียง ---
  const playSound = (file) => {
    const audio = new Audio(`/sounds/${file}`);
    audio.play().catch(() => console.log("Audio play blocked"));
  };

  const drawCard = () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * 4)],
  });

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

    if (hasAce && hasFaceCard && cards.length === 2 && score + 10 === 21) {
      score += 10;
    }
    return score;
  };

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

  // ฟังก์ชันเริ่มเกมใหม่ (ใช้ทั้งตอนกด Start และ Play Again)
  const initGame = () => {
    const newP = [drawCard(), drawCard()];
    const newC = [drawCard(), drawCard()];
    setPlayer(newP);
    setComputer(newC);
    setWinner("");
    setGameOver(false);
    setGameState("play"); // เปลี่ยนไปหน้าเล่นเกม
    playSound("card.mp3");
    checkInitialResult(newP, newC);
  };

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

    if (cs > 21 || ps > cs) {
      setWinner(cs > 21 ? "You Win! (Dealer Bust)" : "You Win! 🏆");
      playSound("win.mp3");
    } else if (cs > ps) {
      setWinner("Computer Wins");
      playSound("lose.mp3");
    } else {
      setWinner("Draw 🤝");
    }
    setGameOver(true);
  };

  // --- 🏠 หน้าจอ Start ---
  const StartScreen = () => (
    <div className="bg-green-800 p-10 rounded-[3rem] shadow-2xl text-center w-full max-w-md border-8 border-yellow-600/50">
      <div className="text-7xl mb-6 drop-shadow-lg">🃏</div>
      <h1 className="text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-md">
        BLACKJACK
      </h1>
      <p className="text-yellow-400 font-bold mb-10 tracking-[0.2em] uppercase text-sm">Royal Casino Edition</p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={initGame} 
          className="bg-yellow-500 text-black font-black py-4 rounded-2xl text-xl shadow-[0_6px_0_rgb(161,98,7)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          START GAME
        </button>
        <button 
          onClick={() => setGameState("how-to")} 
          className="bg-white/10 text-white font-bold py-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
        >
          HOW TO PLAY
        </button>
      </div>
    </div>
  );

  // --- 📖 หน้าจอ คู่มือการเล่น ---
  const HowToScreen = () => (
    <div className="bg-green-800 p-8 rounded-[3rem] shadow-2xl w-full max-w-md border-8 border-yellow-600/50 text-white">
      <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center italic uppercase tracking-widest">Guide</h2>
      <div className="space-y-4 text-sm md:text-base opacity-95 font-medium">
        <div className="flex gap-3 items-start">
          <span className="bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold mt-1">1</span>
          <p>The goal is to get a total score <b>equal to or as close to 21</b> as possible without going over.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold mt-1">2</span>
          <p>Cards <b>J, Q, K</b> are worth 10 points. Numeric cards are worth their face value.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold mt-1">3</span>
          <p>An <b>Ace (A)</b> is worth <b>1</b> point when paired with numbers 2-9.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold mt-1">4</span>
          <p>Get an <b>Ace + (10, J, Q, K)</b> in your first 2 cards to win instantly! (Blackjack)</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold mt-1">5</span>
          <p><b>HIT</b> to draw another card. <b>STAND</b> to keep your current total.</p>
        </div>
      </div>
      <button 
        onClick={() => setGameState("start")} 
        className="mt-8 w-full bg-yellow-500 text-black font-black py-3 rounded-2xl shadow-[0_4px_0_rgb(161,98,7)] hover:shadow-none hover:translate-y-1 transition-all"
      >
        I'M READY
      </button>
    </div>
  );

  // --- 🎮 หน้าจอ เล่นเกม (UI เดิมที่คุณมี) ---
  const GameScreen = () => (
    <div className="bg-green-800 p-8 rounded-[2rem] shadow-2xl text-center w-full max-w-md border-4 border-yellow-600/50 relative">
      <button 
        onClick={() => setGameState("start")}
        className="absolute top-4 left-4 text-white/50 hover:text-white text-xs uppercase font-bold transition-colors"
      >
        🏠 Exit
      </button>

      <h1 className="text-3xl font-black text-white mb-6 tracking-widest drop-shadow-md">
        ♠ <span className="text-yellow-500">PLAYING</span> ♦
      </h1>

      {/* Dealer Area */}
      <div className="bg-black/20 p-4 rounded-2xl mb-6 border border-white/5">
        <h2 className="text-yellow-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Dealer's Hand</h2>
        <div className="flex justify-center gap-2 mb-2">
          {computer.map((c, i) => <Card key={i} card={c} />)}
        </div>
        <p className="text-white font-mono opacity-70 text-xs">Score: {getScore(computer)}</p>
      </div>

      {/* Player Area */}
      <div className="bg-black/20 p-4 rounded-2xl mb-8 border border-white/5">
        <h2 className="text-yellow-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Your Hand</h2>
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
          <button onClick={initGame} className="bg-yellow-500 text-black font-black px-12 py-4 rounded-xl shadow-[0_6px_0_rgb(161,98,7)] hover:shadow-none hover:translate-y-1 transition-all text-xl">PLAY AGAIN</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      {gameState === "start" && <StartScreen />}
      {gameState === "how-to" && <HowToScreen />}
      {gameState === "play" && <GameScreen />}
    </div>
  );
}