import {
  Button,
  Stack as StackUi,
  Text,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkoutContext } from "../../providers/WorkoutProvider";
import { useEffect, useState } from "react";
import ExerciseList from "../../components/ExerciseList";

type Params = { id: string };

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<Params>();
  const theme = useTheme();
  const router = useRouter();

  const { getWorkoutById } = useWorkoutContext();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const workoutItem = getWorkoutById(id);
        setWorkout(workoutItem);
      } catch (e) {
        setError("workout does not exist");
      }
    }
  }, [id]);

  if (error) {
    return (
      <StackUi
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Text>{error}</Text>
      </StackUi>
    );
  }

  const WorkoutHead = ({
    name,
    reps,
    description,
  }: {
    name: string;
    reps: number;
    description?: string | null;
  }) => (
    <YStack padding="$4" borderRadius="$4" backgroundColor={theme.gray1.get()}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$7">{name}</Text>
        <YStack
          padding="$1"
          borderRadius="$8"
          borderColor="black"
          borderWidth={1}
          width="$2"
          height="$2"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="$5">{reps}</Text>
        </YStack>
      </XStack>
      {description && (
        <Text>
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
          cillum sint consectetur cupidatat.
        </Text>
      )}
    </YStack>
  );

  return (
    <StackUi
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack.Screen options={{ title: "workout" }} />
      {workout && (
        <YStack padding="$4" space justifyContent="space-between" height="100%">
          <YStack space>
            <WorkoutHead
              name={workout.name}
              reps={workout.reps}
              description={workout?.description}
            />
            <Text fontSize="$7">Exercises</Text>
            <ExerciseList
              exercises={workout.exercises}
              workoutId={workout.id}
            />
          </YStack>

          <Button
            onPress={() =>
              router.push({
                pathname: "/workout/exercises/form",
                params: { workoutId: workout.id },
              })
            }
          >
            Add new exercise
          </Button>
        </YStack>
      )}
    </StackUi>
  );
}
