import { View } from "react-native";
import { Text, Button, YStack, Input, Label } from "tamagui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useWorkoutContext } from "../../../providers/WorkoutProvider";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMemo } from "react";

type Params = {
  workoutId: string;
  exerciseId?: string;
  title?: string;
};

interface ExerciseFormValues {
  name: string;
  description: string;
  duration: string;
}

// passing in a exerciseId indicates edit mode rather than adding a new exercise
export default function ExerciseFormScreen() {
  const { workoutId, title, exerciseId } = useLocalSearchParams<Params>();
  const { updateExercise, createExercise, getExerciseFromWorkoutById } =
    useWorkoutContext();
  const router = useRouter();

  // load exercise data when in edit mode
  const editExerciseData: Exercise | null = useMemo(
    () => getExerciseFromWorkoutById(workoutId, exerciseId ?? ""),
    [exerciseId]
  );

  const editMode: boolean = !!editExerciseData;

  const initialValues =
    editMode && editExerciseData
      ? {
          name: editExerciseData.name,
          description: editExerciseData.description ?? "",
          duration: editExerciseData.duration.toString(),
        }
      : {
          name: "",
          description: "",
          duration: "30",
        };

  const headerTitle = title ?? "Add new exercise";
  const submitButtonText = editMode ? "Save" : "Add";

  const exerciseValidationSchema = yup.object().shape({
    name: yup.string().required().min(1).max(20),
    description: yup.string().optional().min(1).max(250),
    duration: yup.number().required().min(1).max(300),
  });

  const submitNewExercise = async ({
    name,
    description,
    duration,
  }: ExerciseFormValues) => {
    const newExerciseData = {
      name,
      description: description.length ? description : null,
      duration: Number(duration),
    };
    if (editMode && exerciseId) {
      await updateExercise(workoutId, exerciseId, newExerciseData);
    } else {
      await createExercise(workoutId, newExerciseData);
    }

    return router.push({
      pathname: "/workout",
      params: { id: workoutId },
    });
  };

  const { handleBlur, handleChange, handleSubmit, values, isValid, errors } =
    useFormik({
      initialValues,
      onSubmit: submitNewExercise,
      validationSchema: exerciseValidationSchema,
    });

  return (
    <YStack space padding="$2">
      <Stack.Screen options={{ title: headerTitle, headerShown: true }} />
      <View>
        <Label htmlFor="exercise-name">Exercise Name</Label>
        <Input
          id="exercise-name"
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          value={values.name}
        />
        {errors.name && (
          <Text theme="red_alt2" paddingTop="$2">
            {errors.name}
          </Text>
        )}
      </View>
      <View>
        <Label htmlFor="exercise-description">
          Description (optional) {values.description.length}/250
        </Label>
        <Input
          id="exercise-description"
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          value={values.description}
        />
        {errors.description && (
          <Text theme="red_alt2" paddingTop="$2">
            {errors.description}
          </Text>
        )}
      </View>
      <View>
        <Label htmlFor="exercise-duration">Duration (seconds)</Label>
        <Input
          id="exercise-duration"
          onChangeText={handleChange("duration")}
          onBlur={handleBlur("duration")}
          value={values.duration}
          keyboardType="number-pad"
        />
        {errors.duration && (
          <Text theme="red_alt2" paddingTop="$2">
            {errors.duration}
          </Text>
        )}
      </View>
      <Button onPress={() => handleSubmit()} disabled={!isValid}>
        {submitButtonText}
      </Button>
    </YStack>
  );
}
