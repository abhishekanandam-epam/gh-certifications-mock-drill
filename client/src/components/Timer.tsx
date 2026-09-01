import { useEffect, useRef, useState } from "react";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
  paused?: boolean;
}

export default function Timer({ totalSeconds, onExpire, paused }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, paused]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const low = remaining <= 60;

  return (
    <div className={`timer${low ? " timer-low" : ""}`}>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
