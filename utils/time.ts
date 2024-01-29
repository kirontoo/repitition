// @param time in milliseconds
export function formatToMinAndSec(time: number): string {
  const timeInSeconds = time / 1000;
  const seconds = timeInSeconds % 60;
  const minutes = Math.floor(timeInSeconds / 60);

  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${secondsStr}`;
};


export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
};
