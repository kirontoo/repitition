import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Label, Button, YStack, Input, Group, TextArea } from "tamagui";
import { NavigationRoute, RootStackParamList } from "./types";
import { useState } from "react";
import { useWorkoutContext } from "../providers/WorkoutProvider";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutForm">;
export default function WorkoutFormScreen({ navigation }: Props) {
  const { createWorkout } = useWorkoutContext();

  const [workoutName, setWorkoutName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reps, setReps] = useState<string>("");

  // TODO: ERRORS UI
  // TODO: input validation

  const submitWorkoutInput = () => {
    const repetitions = Number(reps);
    if (isNaN(repetitions)) {
      // set error
      return;
    }

    const newWorkout = {
      name: workoutName,
      description,
      reps: repetitions,
    };
    createWorkout(newWorkout);

    navigation.navigate(NavigationRoute.WorkoutScreen);
  };

  return (
    <YStack padding="$4" space>
      <Group>
        <Label htmlFor="workout-name">Workout Name</Label>
        <Input
          id="workout-name"
          onChangeText={setWorkoutName}
          value={workoutName}
        />
      </Group>
      <Group>
        <Label htmlFor="workout-description">Description (optional)</Label>
        <TextArea
          id="workout-description"
          onChangeText={setDescription}
          value={description}
        />
      </Group>
      <Group>
        <Label htmlFor="workout-repetitions">Number of Repitiions</Label>
        <Input
          id="workout-repetitions"
          onChangeText={setReps}
          value={reps}
          keyboardType="number-pad"
        />
      </Group>
      <Button onPress={submitWorkoutInput}>Add Workout</Button>
    </YStack>
  );
}
