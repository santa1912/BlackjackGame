export default function Card({ card }) {
  const getCardName = () => {
    const valueMap = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const suitMap = { "♥": "H", "♦": "D", "♠": "S", "♣": "C" };

    const v = valueMap[card.value] || card.value;
    const s = suitMap[card.suit];

    return `/cards/${v}${s}.png`;
  };

  return (
    <div className="transition-transform hover:scale-110 shadow-lg rounded-xl bg-white p-1">
      <img
        src={getCardName()}
        alt="card"
        className="w-16 h-24 md:w-20 md:h-28 rounded-lg object-contain"
        onError={(e) => {
          // กรณีไม่มีรูปภาพ ให้แสดงเป็นตัวหนังสือแทน
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="hidden w-16 h-24 md:w-20 md:h-28 border-2 border-gray-400 rounded-lg flex-col items-center justify-center text-black font-bold">
        <span>{card.value > 10 ? (card.value === 11 ? 'J' : card.value === 12 ? 'Q' : 'K') : card.value === 1 ? 'A' : card.value}</span>
        <span className="text-2xl">{card.suit}</span>
      </div>
    </div>
  );
}