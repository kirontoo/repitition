import { useList } from "@uidotdev/usehooks";
import { useContext, createContext, ReactNode } from "react";
import uuid from "react-native-uuid";

interface NewWorkoutInput {
  name: string;
  description: string | null;
  reps: number;
}

type WorkoutContextValue = {
  workouts: Workout[];
  editWorkout: (id: string, data: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  createWorkout: (data: NewWorkoutInput) => void;
};

export const WorkoutContext = createContext<WorkoutContextValue>({
  workouts: [],
  editWorkout: (_i, _d) => null,
  deleteWorkout: (_) => null,
  createWorkout: (_) => null,
});

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error(
      "useCommunityContext must be used within a CommunityProvider"
    );
  }
  return context;
};

export const useWorkoutProvider = () => {
  const [workouts, workoutsControl] = useList<Workout>([]);

  const editWorkout = (id: string, data: Partial<Workout>) => {
    const index = workouts.findIndex((w: Workout) => w.id === id);

    // workout does not exist
    if (index < 0) {
      throw new Error("workout does not exist");
    }

    const workoutToChange = workouts[index];

    // TODO: validate data

    // update workout
    const updatedWorkout = Object.assign(workoutToChange, data);

    workoutsControl.removeAt(index);
    workoutsControl.insertAt(index, updatedWorkout);
  };

  const deleteWorkout = (id: string) => {
    const index = workouts.findIndex((w) => w.id === id);
    if (index < 0) {
      return;
    }

    workoutsControl.removeAt(index);
  };

  const createWorkout = (data: NewWorkoutInput) => {
    const createdAt = new Date().toISOString();
    const id = uuid.v4().toString();
    const newWorkout = {
      ...data,
      createdAt,
      id,
      exercises: [],
    };

    workoutsControl.push(newWorkout);
  };

  return {
    workouts,
    createWorkout,
    deleteWorkout,
    editWorkout,
  };
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const data = useWorkoutProvider();
  return (
    <WorkoutContext.Provider value={data}>{children}</WorkoutContext.Provider>
  );
}
