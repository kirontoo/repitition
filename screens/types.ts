export const NavigationRoute: Record<string, keyof RootStackParamList > = {
  NewWorkout: "NewWorkout",
  Home: "Home",
  Details: "Details",
  ExerciseForm: "ExerciseForm",
  ExerciseList: "ExerciseList",
}

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  NewWorkout: undefined;
  ExerciseForm: undefined,
  ExerciseList: undefined,
};
