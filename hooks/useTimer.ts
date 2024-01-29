import { useState, useEffect } from "react";

type UseTimerReturnType = {
  currentTime: number;
  start: () => void;
  pause: () => void;
  unpause: () => void;
  stop: () => void;
  set: (milliseconds: number) => void;
  isPaused: boolean;
}

// @param initialTime initial countdown timer in milliseconds
// @param interval optional
// @param callback optional runs after timer reaches zero
export default function useTimer(
  initialTime: number,
  interval = 1000,
  callback?: () => void
): UseTimerReturnType {
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  let timer: ReturnType<typeof setInterval> | null = null;

  useEffect(() => {
    startTimer();

    if (currentTime === 0) {
      callback && callback();
    }

    return () => stopTimer();
  }, [currentTime, isPaused])

  const runTimer = () => {
    // stop timer if paused
    if (isPaused) {
      return;
    }

    if (currentTime > 0) {
      setCurrentTime((c) => {
        const nextTime = c - interval;
        return nextTime;
      });
    }
  }

  // start the timer
  const startTimer = () => {
    timer = setInterval(runTimer, interval);
  }

  // pause the timer
  const pauseTimer = () => {
    setIsPaused(true);
  }

  const unpauseTimer = () => {
    setIsPaused(false);
  }

  // end the timer
  const stopTimer = () => {
    timer && clearInterval(timer);
  }

  const setTimer = (milliseconds: number) => {
    if (milliseconds < 0) {
      return;
    }
    setCurrentTime(milliseconds);
  }

  return {
    currentTime,
    start: startTimer,
    pause: pauseTimer,
    unpause: unpauseTimer,
    stop: stopTimer,
    set: setTimer,
    isPaused
  };
}
