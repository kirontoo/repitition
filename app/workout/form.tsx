import { Button, YStack, Label, TextArea, Input, View, Text } from "tamagui";
import {
  NewWorkoutInput,
  useWorkoutContext,
} from "../../providers/WorkoutProvider";
import { Stack, useRouter } from "expo-router";
import * as yup from "yup";
import { Formik } from "formik";

interface WorkoutFormValues {
  name: string;
  description: string;
  reps: string;
}

export default function WorkoutFormScreen() {
  const { createWorkout } = useWorkoutContext();

  const router = useRouter();
  const initValues = {
    name: "",
    description: "",
    reps: "1",
  };

  const workoutValidationSchema = yup.object().shape({
    name: yup.string().required().min(1).max(20),
    description: yup.string().optional().min(1).max(250),
    reps: yup.number().required().min(1).max(10),
  });

  const addNewWorkout = async ({name, description, reps}: WorkoutFormValues) => {
    const repitiions = Number(reps);

    const newWorkout: NewWorkoutInput = {
      name,
      description,
      reps: repitiions,
    };
    const { id } = await createWorkout(newWorkout);

    router.push({ pathname: "/workout", params: { id } });
  };

  return (
    <Formik
      validationSchema={workoutValidationSchema}
      initialValues={initValues}
      onSubmit={addNewWorkout}
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
            options={{ title: "Add New Workout", headerShown: true }}
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
            Add Workout
          </Button>
        </YStack>
      )}
    </Formik>
  );
}
