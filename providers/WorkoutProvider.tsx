import { useList } from "@uidotdev/usehooks";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import uuid from "react-native-uuid";
import { getLocalWorkoutData, storeLocalWorkoutData } from "../utils/storage";

interface NewWorkoutInput {
  name: string;
  description: string | null;
  reps: number;
}

interface NewExerciseInput {
  name: string;
  description: string | null;
  duration: number;
}

type WorkoutContextValue = {
  workouts: Workout[];
  editWorkout: (id: string, data: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  createWorkout: (data: NewWorkoutInput) => Promise<Workout>;
  getWorkoutById: (id: string) => Workout;
  loadingWorkouts: boolean;
  createExercise: (workoutId: string, data: NewExerciseInput) => Promise<Workout>;
};

export const WorkoutContext = createContext<WorkoutContextValue>({
  workouts: [],
  editWorkout: (_i, _d) => null,
  deleteWorkout: (_) => null,
  createWorkout: async (_) => ({} as Workout),
  loadingWorkouts: false,
  getWorkoutById: (_) => ({} as Workout),
  createExercise: async (_i, _d) => ({} as Workout)
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

const MOCK_DATA = {
  id: "657215d66c6186c1a50bc3e9",
  name: "Slow mo",
  reps: 1,
  description:
    "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
  exercises: [
    {
      id: "657218766c6186c1a50bc3f6",
      name: "Swallow",
      description:
        "quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna",
      duration: 69,
    },
    {
      id: "657218d56c6186c1a50bc403",
      name: "Spoonbill",
      description: "ut odio cras mi pede malesuada in imperdiet et commodo",
      duration: 139,
    },
    {
      id: "657218d56c6186c1a50bc402",
      name: "Kangaroo",
      description:
        "pellentesque at nulla suspendisse potenti cras in purus eu magna",
      duration: 97,
    },
    {
      id: "657218d56c6186c1a50bc401",
      name: "tree rat",
      description: null,
      duration: 15,
    },
  ],
  createdAt: "5/6/2023",
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
      const data = await getLocalWorkoutData();
      workoutsControl.set(data ?? [MOCK_DATA]);
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

  const createWorkout = async (data: NewWorkoutInput): Promise<Workout> => {
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
    await storeLocalWorkoutData([...workouts, newWorkout]);

    return newWorkout;
  };

  const getWorkoutById = (id: string): Workout => {
    const workout = workouts.find((w) => w.id === id);
    if (workout === undefined) {
      throw new Error("workout does not exist");
    }

    return workout;
  };

  const createExercise = async (workoutId: string, data: NewExerciseInput) => {
    const targetWorkout = getWorkoutById(workoutId);
    const workoutIndexPos = workouts.findIndex((workout) => workout.id === workoutId);

    const exerciseId = uuid.v4().toString();
    const newExercise: Exercise = {
      ...data,
      id: exerciseId,
    };

    targetWorkout.exercises.push(newExercise);
    workoutsControl.updateAt(workoutIndexPos, targetWorkout);
    await storeLocalWorkoutData([...workouts]);

    return targetWorkout;
  };

  return {
    workouts,
    createWorkout,
    deleteWorkout,
    editWorkout,
    loadingWorkouts,
    getWorkoutById,
    createExercise
  };
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const data = useWorkoutProvider();
  return (
    <WorkoutContext.Provider value={data}>{children}</WorkoutContext.Provider>
  );
}
