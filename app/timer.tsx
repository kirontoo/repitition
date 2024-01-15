import { Text, XStack, YStack, useTheme, Button, H1 } from "tamagui";
import { Stack, useLocalSearchParams } from "expo-router";
import useTimer from "../hooks/useTimer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkoutContext } from "../providers/WorkoutProvider";
import { useMemo, useState } from "react";

type Params = {
  workoutId: string;
};

export default function TimerScreen() {
  const inset = useSafeAreaInsets();
  const theme = useTheme();

  // load exercises
  const { workoutId } = useLocalSearchParams<Params>();
  const { getExercisesFromWorkout } = useWorkoutContext();
  const exercises = getExercisesFromWorkout(workoutId);
  const [currExerciseIndex, setCurrExerciseIndex] = useState<number>(0);

  const [mode, setMode] = useState<"break" | "workout">("workout");

  // break duration: 30s
  const breakDuration = 30000;

  const exercise = useMemo(
    () => exercises[currExerciseIndex],
    [currExerciseIndex]
  );

  const secondsToMilliseconds = (seconds: number) => {
    return seconds * 1000;
  };

  const onTimerEnds = () => {
    if (mode === "break") {
      // load & set the next exercise timer
      if (currExerciseIndex < exercises.length) {
        setMode("workout");

        setCurrExerciseIndex((i) => ++i);
        timer.set(secondsToMilliseconds(exercises[currExerciseIndex].duration));
      }
    } else if (mode === "workout") {
      if (currExerciseIndex + 1 === exercises.length) {
        // reached end of exercises queue, stop all timers
        return;
      }
      setMode("break");
      timer.set(breakDuration);
    }
  };

  const timer = useTimer(
    exercises[currExerciseIndex].duration * 1000,
    1000,
    onTimerEnds
  );

  // @param initialTime in milliseconds
  const calcTimerPercentage = (initialTime: number): number => {
    return (timer.currentTime / initialTime) * 100;
  };

  const timerProgressPercentage = useMemo(() => {
    if (!exercise) {
      // 100% progress
      return 100;
    }

    if (mode === "break") {
      return calcTimerPercentage(breakDuration);
    } else {
      return calcTimerPercentage(exercise.duration);
    }
  }, [mode, exercise]);

  // @param time in milliseconds
  const formatToMinAndSec = (time: number): string => {
    const timeInSeconds = time / 1000;
    const seconds = timeInSeconds % 60;
    const minutes = Math.floor(timeInSeconds / 60);

    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${secondsStr}`;
  };

  const nextExercise = () => {
    timer.stop();
    // TODO: load next exercise
  };

  return (
    <YStack
      padding="$2"
      paddingTop={inset.top}
      paddingBottom={inset.bottom}
      alignItems="center"
      justifyContent="space-between"
      height="100%"
    >
      <Stack.Screen options={{ title: "timer", headerShown: false }} />
      <XStack justifyContent="flex-end" width="100%" marginTop="$1">
        <Button unstyled variant="outlined">
          <MaterialIcons name="more-vert" size={16} color={theme.color.val} />
        </Button>
      </XStack>

      <YStack alignItems="center" justifyContent="center" space="$3">
        <YStack justifyContent="center">
          <H1 fontSize="$8" textAlign="center">
            {mode === "break" ? "Break" : exercise.name}
          </H1>
          {mode === "break" && (
            <Text textAlign="center" fontSize="$4">
              Rest up!
            </Text>
          )}
        </YStack>
        <AnimatedCircularProgress
          size={240}
          width={8}
          tintColor={theme.color8.val}
          fill={timerProgressPercentage}
        >
          {() => (
            <Text fontSize="$9" textAlign="center">
              {formatToMinAndSec(timer.currentTime)}
            </Text>
          )}
        </AnimatedCircularProgress>
        {timer.isPaused ? (
          <Button circular onPress={timer.unpause}>
            <MaterialIcons
              name="play-arrow"
              size={16}
              color={theme.color.val}
            />
          </Button>
        ) : (
          <Button circular onPress={timer.pause}>
            <MaterialIcons name="pause" size={16} color={theme.color.val} />
          </Button>
        )}
      </YStack>

      <XStack
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        marginBottom="$2"
      >
        <Text fontSize="$5">2/10</Text>
        <Button variant="outlined" size="$2" unstyled>
          <MaterialIcons
            name="skip-next"
            size={20}
            color={theme.color.val}
            onPress={nextExercise}
          />
        </Button>
      </XStack>
    </YStack>
  );
}
