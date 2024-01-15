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

export interface WorkoutInputValues {
  name: string;
  description: string | null;
  reps: number;
}

export interface ExerciseInputValues {
  name: string;
  description: string | null;
  duration: number;
}

type WorkoutContextValue = {
  workouts: Workout[];
  updateWorkout: (id: string, data: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  createWorkout: (data: WorkoutInputValues) => Promise<Workout>;
  getWorkoutById: (id: string) => Workout;
  loadingWorkouts: boolean;
  createExercise: (
    workoutId: string,
    data: ExerciseInputValues
  ) => Promise<Workout>;
  getExercisesFromWorkout: (workoutId: string) => Exercise[];
  getExerciseFromWorkoutById: (
    workoutId: string,
    exerciseId: string
  ) => Exercise | null;
  updateExercise: (
    workoutId: string,
    exerciseId: string,
    data: ExerciseInputValues
  ) => Promise<void>;
  deleteExercise: (workoutId: string, exerciseId: string) => Promise<void>;
};

export const WorkoutContext = createContext<WorkoutContextValue>({
  workouts: [],
  updateWorkout: async (_i, _d) => {},
  deleteWorkout: async (_) => {},
  createWorkout: async (_) => ({} as Workout),
  loadingWorkouts: false,
  getWorkoutById: (_) => ({} as Workout),
  createExercise: async (_i, _d) => ({} as Workout),
  getExercisesFromWorkout: (_) => [],
  getExerciseFromWorkoutById: (_w, _e) => null,
  updateExercise: async (_w, _e, _d) => {},
  deleteExercise: async () => {},
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
      duration: 10,
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

  const updateWorkout = async (id: string, data: Partial<Workout>) => {
    const index = workouts.findIndex((w: Workout) => w.id === id);

    // workout does not exist
    if (index < 0) {
      throw new Error("workout does not exist");
    }

    const workoutToChange = workouts[index];

    // update workout
    const updatedWorkout = Object.assign(workoutToChange, data);

    workoutsControl.removeAt(index);
    workoutsControl.insertAt(index, updatedWorkout);

    await storeLocalWorkoutData([...workouts]);
  };

  const deleteWorkout = async (id: string) => {
    const index = workouts.findIndex((w) => w.id === id);
    if (index < 0) {
      return;
    }

    workoutsControl.removeAt(index);
    await storeLocalWorkoutData([...workouts]);
  };

  const createWorkout = async (data: WorkoutInputValues): Promise<Workout> => {
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

  const createExercise = async (
    workoutId: string,
    data: ExerciseInputValues
  ) => {
    const targetWorkout = getWorkoutById(workoutId);
    const workoutIndexPos = workouts.findIndex(
      (workout) => workout.id === workoutId
    );

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

  const getExerciseFromWorkoutById = (
    workoutId: string,
    exerciseId: string
  ) => {
    if (exerciseId.length === 0) {
      return null;
    }

    const { exercises } = getWorkoutById(workoutId);
    const exercise = exercises.find((e) => e.id === exerciseId);

    return exercise ?? null;
  };

  const getExercisesFromWorkout = (workoutId: string): Exercise[] => {
    const { exercises } = getWorkoutById(workoutId);
    return exercises;
  };

  const updateExercise = async (
    workoutId: string,
    exerciseId: string,
    data: ExerciseInputValues
  ) => {
    // find target workout
    const workout = getWorkoutById(workoutId);
    const workoutIndexPos = workouts.findIndex(
      (workout) => workout.id === workoutId
    );

    // find target exercise
    const { exercises } = workout;
    const targetExerciseIndex = exercises.findIndex((e) => e.id === exerciseId);
    if (targetExerciseIndex < 0) {
      throw new Error("exercise does not exist");
    }

    // edit existing exercise
    const newExerciseData = { ...exercises[targetExerciseIndex], ...data };
    exercises[targetExerciseIndex] = newExerciseData;

    // update workouts state
    const workoutToReplace = {
      ...workout,
      exercises,
    };
    workoutsControl.updateAt(workoutIndexPos, workoutToReplace);
    await storeLocalWorkoutData([...workouts]);
  };

  const deleteExercise = async (workoutId: string, exerciseId: string) => {
    const workout = getWorkoutById(workoutId);
    const workoutIndexPos = workouts.findIndex(
      (workout) => workout.id === workoutId
    );

    const exercises = workout.exercises.filter(({ id }) => id !== exerciseId);

    // update workout state
    const workoutToReplace = {
      ...workout,
      exercises,
    };
    workoutsControl.updateAt(workoutIndexPos, workoutToReplace);
    await storeLocalWorkoutData([...workouts]);
  };

  return {
    createExercise,
    createWorkout,
    deleteWorkout,
    updateWorkout,
    getExerciseFromWorkoutById,
    getExercisesFromWorkout,
    getWorkoutById,
    loadingWorkouts,
    updateExercise,
    workouts,
    deleteExercise,
  };
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const data = useWorkoutProvider();
  return (
    <WorkoutContext.Provider value={data}>{children}</WorkoutContext.Provider>
  );
}
