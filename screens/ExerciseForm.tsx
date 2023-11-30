import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "./types";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "NewWorkout">;
export default function ExerciseForm({ navigation }: Props) {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // duration is in seconds
  const [duration, setDuration] = useState<string>("");
  return (
    <View>
      <Text>Exercise Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setExerciseName}
        value={exerciseName}
      />
      <Text>Description (optional)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
      />
      <TextInput
        style={styles.input}
        onChangeText={setDuration}
        value={duration}
      />
      <Button title="Add Exercise" onPress={() => {}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
