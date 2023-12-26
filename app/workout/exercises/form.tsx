import {  View } from "react-native";
import { Button, YStack, Input, Label } from "tamagui";
import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useWorkoutContext } from "../../../providers/WorkoutProvider";

type Params = { 
  workoutId: string; 
  exerciseId?: string; 
  title?: string 
};

export default function ExerciseFormScreen() {
  const { workoutId, title } = useLocalSearchParams<Params>();
  const { createExercise } = useWorkoutContext();
  const router = useRouter();

  const headerTitle = title ?? "Add new exercise";

  const [exerciseName, setExerciseName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // duration is in seconds
  const [duration, setDuration] = useState<string>("");

  const submitNewExercise = async () => {
    // TODO: input validation
    await createExercise(workoutId, {
      name: exerciseName,
      description: description.length ? description : null,
      duration: Number(duration),
    });

    router.back();
  };
  return (
    <YStack space padding="$2">
      <Stack.Screen options={{ title: headerTitle, headerShown: true }} />
      <View>
        <Label htmlFor="exercise-name">Exercise Name</Label>
        <Input
          id="exercise-name"
          onChangeText={setExerciseName}
          value={exerciseName}
        />
      </View>
      <View>
        <Label htmlFor="exercise-description">Description (optional)</Label>
        <Input
          id="exercise-description"
          onChangeText={setDescription}
          value={description}
        />
      </View>
      <View>
        <Label htmlFor="exercise-duration">Duration (seconds)</Label>
        <Input
          id="exercise-duration"
          onChangeText={setDuration}
          value={duration}
          keyboardType="number-pad"
        />
      </View>
      <Button onPress={submitNewExercise}>Add Exercise</Button>
    </YStack>
  );
}
