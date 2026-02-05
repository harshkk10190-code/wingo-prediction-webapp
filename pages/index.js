import { useEffect, useState } from "react";

function getUTCPeriod() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  const totalMinutes =
    now.getUTCHours() * 60 + now.getUTCMinutes();

  return `${year}${month}${day}1000${10001 + totalMinutes}`;
}

function generatePrediction(period) {
  const seed = parseInt(period.slice(-4));
  const isBig = seed % 2 === 0;

  if (isBig) {
    const bigNums = [5, 6, 7, 8, 9];
    const n1 = bigNums[(seed + 1) % 5];
    const n2 = bigNums[(seed + 3) % 5];
    return { type: "BIG", nums: [n1, n2] };
  } else {
    const smallNums = [0, 1, 2, 3, 4];
    const n1 = smallNums[(seed + 2) % 5];
    const n2 = smallNums[(seed + 4) % 5];
    return { type: "SMALL", nums: [n1, n2] };
  }
}

export default function Home() {
  const [period, setPeriod] = useState(getUTCPeriod());
  const [seconds, setSeconds] = useState(60);
  const [prediction, setPrediction] = useState(
    generatePrediction(period)
  );
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s === 1) {
          const newPeriod = getUTCPeriod();
          const newPred = generatePrediction(newPeriod);

          setHistory((h) => [
            { period, ...prediction },
            ...h.slice(0, 9),
          ]);

          setPeriod(newPeriod);
          setPrediction(newPred);
          return 60;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [period, prediction]);

  return (
    <div className="container">
      <div className="header">KIRA VIP</div>
      <div className="timer">
        ⏱️ {seconds}s | Period: {period}
      </div>

      <div className="prediction-box">
        <div className="prediction-text">
          {prediction.type}
        </div>
        <div className="balls">
          {prediction.nums.map((n, i) => (
            <div key={i} className="ball">
              {n}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px", color: "#00ffea" }}>
          🔒 Prediction Locked
        </div>
      </div>

      <div className="history">
        <h3>Last 10 Predictions</h3>
        {history.map((h, i) => (
          <div key={i} className="history-item">
            {h.period} → {h.type} ({h.nums.join(", ")})
          </div>
        ))}
      </div>
    </div>
  );
}
