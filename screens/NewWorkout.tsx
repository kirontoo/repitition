import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "./types";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "NewWorkout">;
export default function NewWorkoutScreen({ navigation }: Props) {
  const [workoutName, setWorkoutName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  return (
    <View>
      <Text>Workout Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setWorkoutName}
        value={workoutName}
      />
      <Text>Description (optional)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
      />
      <Button title="Add Exercises" onPress={() => {}}/>
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
