import { useList } from "@uidotdev/usehooks";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import uuid from "react-native-uuid";
import { getData, storeData } from "../utils/storage";

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
  loadingWorkouts: boolean;
};

export const WorkoutContext = createContext<WorkoutContextValue>({
  workouts: [],
  editWorkout: (_i, _d) => null,
  deleteWorkout: (_) => null,
  createWorkout: (_) => null,
  loadingWorkouts: false,
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
  const [loadingWorkouts, setLoadingWorkouts] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingWorkouts(true);
    try {
      const data = await getData();
      workoutsControl.set(data ?? []);
    } catch (e) {
    } finally {
      setLoadingWorkouts(false);
    }
  };

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

  const createWorkout = async (data: NewWorkoutInput) => {
    const createdAt = new Date().toISOString();
    const id = uuid.v4().toString();
    const newWorkout = {
      ...data,
      createdAt,
      id,
      exercises: [],
    };

    // save to state and local storage
    workoutsControl.push(newWorkout);
    await storeData([...workouts, newWorkout]);
  };

  return {
    workouts,
    createWorkout,
    deleteWorkout,
    editWorkout,
    loadingWorkouts
  };
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const data = useWorkoutProvider();
  return (
    <WorkoutContext.Provider value={data}>{children}</WorkoutContext.Provider>
  );
}
