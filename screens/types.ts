export const NavigationRoute: Record<string, keyof RootStackParamList> = {
  WorkoutForm: "WorkoutForm",
  Home: "Home",
  Details: "Details",
  ExerciseForm: "ExerciseForm",
  ExerciseList: "ExerciseList",
}

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  WorkoutForm: undefined;
  ExerciseForm: undefined,
  ExerciseList: undefined,
};
