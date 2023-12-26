import ExerciseItem from "./ExerciseItem";
import { FlatList } from "react-native";

interface ExerciseProps {
  exercises: Exercise[];
  workoutId: string;
}

export default function ExerciseList({ workoutId, exercises }: ExerciseProps) {
  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => (
        <ExerciseItem exercise={item} workoutId={workoutId} />
      )}
      keyExtractor={(item) => item.id}
      style={{
        width: "100%",
      }}
    />
  );
}
