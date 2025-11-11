
import React, { useState, useEffect } from 'react';

interface TimerProps {
  endTime: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ endTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = Math.max(0, endTime - Date.now());
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  const minutes = Math.floor((timeLeft / 1000) / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const timeColor = timeLeft < 10000 ? 'text-red-500' : 'text-white';

  return (
    <div className={`text-4xl font-mono font-bold ${timeColor}`}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
