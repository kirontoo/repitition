import { useState } from "react";
import { Button, YStack, Label, TextArea, Input, View } from "tamagui";
import { useWorkoutContext } from "../../providers/WorkoutProvider";
import { Stack, useRouter } from "expo-router";

export default function WorkoutFormScreen() {
  const { createWorkout } = useWorkoutContext();

  const [workoutName, setWorkoutName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reps, setReps] = useState<string>("");

  const router = useRouter();

  // TODO: react-hook-form and validate form + errors
  const addNewWorkout = async () => {
    const repetitions = Number(reps);
    if (isNaN(repetitions)) {
      // TODO: set error
      return;
    }

    const newWorkout = {
      name: workoutName,
      description,
      reps: repetitions,
    };
    const { id } = await createWorkout(newWorkout);

    router.push({ pathname: "/workout", params: { id } });
  };

  return (
    <YStack padding="$2" >
      <Stack.Screen options={{ title: "Add New Workout", headerShown: true}}/>
      <View>
        <Label htmlFor="workout-name">Workout Name</Label>
        <Input
          id="workout-name"
          onChangeText={setWorkoutName}
          value={workoutName}
        />
      </View>
      <View>
        <Label htmlFor="workout-description">Description (optional)</Label>
        <TextArea
          id="workout-description"
          onChangeText={setDescription}
          value={description}
        />
      </View>
      <View>
        <Label htmlFor="workout-repetitions">Number of Repitiions</Label>
        <Input
          id="workout-repetitions"
          onChangeText={setReps}
          value={reps}
          keyboardType="number-pad"
        />
      </View>
      <Button onPress={addNewWorkout} marginTop="$4">Add Workout</Button>
    </YStack>
  );
}
