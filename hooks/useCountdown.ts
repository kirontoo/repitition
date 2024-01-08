import { useState, useEffect } from "react";

// @param initialTime initial countdown timer in milliseconds
// @param interval optional
// @param callback optional runs after timer reaches zero
export default function useTimer(initialTime: number, interval = 1000, callback?: () => void) {
  const [currentTime, setCurrentTime] = useState<number>(initialTime);

  let timer: ReturnType<typeof setInterval> | null = null;

  useEffect(() => {
    startTimer();

    if(currentTime === 0) {
      callback && callback();
    }

    return () => stopTimer();
  }, [currentTime])

  const runTimer = () => {
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
    stop();
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
    time: currentTime,
    start: startTimer,
    pause: pauseTimer,
    stop: stopTimer,
    set: setTimer,
  };
}
