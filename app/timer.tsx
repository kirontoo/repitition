import { Text, XStack, YStack, useTheme, Button, H1 } from "tamagui";
import { Stack, useLocalSearchParams } from "expo-router";
import useTimer from "../hooks/useTimer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkoutContext } from "../providers/WorkoutProvider";
import { useMemo, useState } from "react";
import { formatToMinAndSec} from "../utils/time";

type Params = {
  workoutId: string;
};

export default function TimerScreen() {
  const inset = useSafeAreaInsets();
  const theme = useTheme();

  // load exercises
  const { workoutId } = useLocalSearchParams<Params>();
  const { getExercisesFromWorkout, getWorkoutById } = useWorkoutContext();
  const workout = getWorkoutById(workoutId);
  const exercises = workout.exercises;
  const [currExerciseIndex, setCurrExerciseIndex] = useState<number>(0);
  const [currRep, setCurrRep] = useState<number>(1);

  // only two modes: workout or break time
  const [mode, setMode] = useState<"break" | "workout" | "long-break">(
    "workout"
  );

  // break duration: 30s
  const breakDuration = 30000;
  const longBreakDuration = 63000;

  const currentExercise = useMemo(
    () => exercises[currExerciseIndex],
    [currExerciseIndex]
  );

  const secondsToMilliseconds = (seconds: number) => {
    return seconds * 1000;
  };

  const nextExercise = () => {
    if (currExerciseIndex + 1 === exercises.length) {
      // reached end of exercises queue, finished 1 rep
      timer.stop();

      // start long break
      if (currRep < workout.reps) {
        timer.set(longBreakDuration);
        timer.start();
      } else {
        timer.stop();
        // end of reps, finished workout!
      }
      return;
    } else if (currExerciseIndex <= exercises.length) {
      // load & set the next exercise timer
      setMode("workout");
      setCurrExerciseIndex((i) => ++i);
      timer.stop();
      timer.set(secondsToMilliseconds(exercises[currExerciseIndex].duration));
      timer.start();
    }
  };

  const onTimerEnds = () => {
    if (mode === "workout") {
      // reached end of exercises queue, stop all timers
      if (currExerciseIndex + 1 === exercises.length) {
        return;
      }
      setMode("break");
      timer.set(breakDuration);
    } else if (mode === "long-break") {
      // start next rep
      // next rep
      if (currRep < workout.reps) {
        setCurrRep((r) => r++);
        setCurrExerciseIndex(0);
        timer.set(secondsToMilliseconds(exercises[0].duration));
      }
    } else {
      // if curr mode: "break"
      nextExercise();
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
    if (!currentExercise) {
      // 100% progress
      return 100;
    }

    if (mode === "break") {
      return calcTimerPercentage(breakDuration);
    } else if (mode === "long-break") {
      return calcTimerPercentage(longBreakDuration);
    } else {
      return calcTimerPercentage(currentExercise.duration * 1000);
    }
  }, [mode, currentExercise.duration, timer]);

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

      <YStack alignItems="center" justifyContent="center" space="$4">
        <YStack justifyContent="center" padding={0} margin={0}>
          <H1 fontSize="$8" textAlign="center">
            {mode === "break" ? "Break" : currentExercise.name}
          </H1>
          {mode === "workout" && (
            <Text fontSize="$5" textAlign="center">
              ({currExerciseIndex + 1}/{exercises && exercises.length})
            </Text>
          )}
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
        <YStack>
          <Text fontSize="$1">Reps</Text>
          <Text fontSize="$5">
            {currRep}/{workout && workout.reps}
          </Text>
        </YStack>
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
