import { XStack, Text, Button, Stack } from "tamagui";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

interface ExerciseItemProps {
  exercise: Exercise;
  workoutId: string;
}

export default function ExerciseItem({
  workoutId,
  exercise,
}: ExerciseItemProps) {
  const router = useRouter();
  return (
    <Button
      style={styles.button}
      margin="$1"
      onPress={() =>
        router.push({
          pathname: "/workout/exercises/form",
          params: {
            workoutId,
            exerciseId: exercise.id,
            title: `Edit ${exercise.name}`,
          },
        })
      }
    >
      <XStack space flex={1} justifyContent="space-between" alignItems="center">
        <Text fontSize="$5">{exercise.name}</Text>
        <Stack
          borderRadius="$6"
          borderColor="white"
          borderWidth={1}
          width="$2"
          height="$2"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{exercise.duration}</Text>
        </Stack>
      </XStack>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
  }
});
