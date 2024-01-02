import ExerciseItem from "./ExerciseItem";
import { FlatList } from "react-native";
import SwipeableListItem from "./SwipeableListItem";
import { useWorkoutContext } from "../providers/WorkoutProvider";
import { useRouter } from "expo-router";

interface ExerciseProps {
  exercises: Exercise[];
  workoutId: string;
}

export default function ExerciseList({ workoutId, exercises }: ExerciseProps) {
  const { deleteExercise } = useWorkoutContext();
  const router = useRouter();

  const swipeLeftAction = async ({ id }: Exercise) => {
    await deleteExercise(workoutId, id);
  };

  const swipeRightAction = ({ id, name }: Exercise) => {
    router.push({
      pathname: "/workout/exercises/form",
      params: {
        workoutId,
        exerciseId: id,
        title: `Edit ${name}`,
      },
    });
  };

  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => (
        <SwipeableListItem
          swipeLeftAction={() => swipeLeftAction(item)}
          swipeRightAction={() => swipeRightAction(item)}
        >
          <ExerciseItem exercise={item} workoutId={workoutId} />
        </SwipeableListItem>
      )}
      keyExtractor={(item) => item.id}
      style={{
        width: "100%",
      }}
    />
  );
}
