export default function Card({ card }) {

  const getCardName = () => {
    let value = card.value;
    let suit = card.suit;

    const valueMap = {
      1: "A",
      11: "J",
      12: "Q",
      13: "K"
    };

    const suitMap = {
      "♥": "H",
      "♦": "D",
      "♠": "S",
      "♣": "C"
    };

    const v = valueMap[value] || value;
    const s = suitMap[suit];

    return `/cards/${v}${s}.png`;
  };

  return (
    <img
      src={getCardName()}
      alt="card"
      width="80"
    />
  );
}