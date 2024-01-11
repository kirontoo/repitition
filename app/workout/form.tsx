import { Button, YStack, Label, TextArea, Input, View, Text } from "tamagui";
import {
  WorkoutInputValues,
  useWorkoutContext,
} from "../../providers/WorkoutProvider";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as yup from "yup";
import { Formik } from "formik";
import { useMemo } from "react";

interface WorkoutFormValues {
  name: string;
  description: string;
  reps: string;
}

type Params = {
  workoutId?: string;
  title?: string;
}

export default function WorkoutFormScreen() {
  const { createWorkout, getWorkoutById, updateWorkout } = useWorkoutContext();
  const { workoutId, title } = useLocalSearchParams<Params>();
  const router = useRouter();

  // load workout data when in edit mode
  const editWorkoutData: Workout | null = useMemo(() => {
    if (workoutId) {
      return getWorkoutById(workoutId);
    }
    return null;
  }, [workoutId]);

  const editMode: boolean = !!editWorkoutData;
  const headerTitle = editMode && editWorkoutData
    ? `Edit ${editWorkoutData.name}`
    : title ?? "Add new workout";
  const submitBtnText = editMode ? 'Save' : 'Add';

  const initValues: WorkoutFormValues = {
    name: editWorkoutData?.name ?? "",
    description: editWorkoutData?.description ?? "",
    reps: editWorkoutData?.reps.toString() ?? "1",
  };

  const workoutValidationSchema = yup.object().shape({
    name: yup.string().required().min(1).max(20),
    description: yup.string().optional().min(1).max(250).default(""),
    reps: yup.number().required().min(1).max(10),
  });

  const submitWorkout = async ({ name, description, reps }: WorkoutFormValues) => {
    const repetiions = Number(reps);
    const newWorkout: WorkoutInputValues = {
      name,
      description,
      reps: repetiions,
    };
    if (editMode && workoutId) {
      await updateWorkout(workoutId, newWorkout);
      router.push({ pathname: "/workout", params: { id: workoutId } });

    } else {
      const { id } = await createWorkout(newWorkout);
      router.push({ pathname: "/workout", params: { id } });
    }
  }

  return (
    <Formik
      validationSchema={workoutValidationSchema}
      initialValues={initValues}
      onSubmit={submitWorkout}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        handleBlur,
        errors,
        isValid,
      }) => (
        <YStack padding="$2">
          <Stack.Screen
            options={{ title: headerTitle, headerShown: true }}
          />

          <View>
            <Label htmlFor="name">Workout Name</Label>
            <Input
              id="name"
              onChangeText={handleChange("name")}
              value={values.name}
              onBlur={handleBlur("name")}
            />
            {errors.name && (
              <Text theme="red_alt2" paddingTop="$2">
                {errors.name}
              </Text>
            )}
          </View>
          <View>
            <Label htmlFor="description">
              Description (optional) {values.description.length}/250
            </Label>
            <TextArea
              id="description"
              onChangeText={handleChange("description")}
              value={values.description}
              onBlur={handleBlur("description")}
              size="$5"
            />
            {errors.description && (
              <Text theme="red_alt2" paddingTop="$2">
                {errors.description}
              </Text>
            )}
          </View>
          <View>
            <Label htmlFor="reps">Number of Repitiions</Label>
            <Input
              id="reps"
              onChangeText={handleChange("reps")}
              value={values.reps}
              keyboardType="number-pad"
              onBlur={handleBlur("reps")}
            />
            {errors.reps && (
              <Text theme="red_alt2" paddingTop="$2">
                {errors.reps}
              </Text>
            )}
          </View>
          <Button
            onPress={() => handleSubmit()}
            marginTop="$4"
            disabled={!isValid}
          >
            {submitBtnText}
          </Button>
        </YStack>
      )}
    </Formik>
  );
}
