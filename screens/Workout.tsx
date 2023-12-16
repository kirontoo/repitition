import { Separator, Stack, Text, XStack, YStack } from "tamagui";
import { RootStackParamList } from "./types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useWorkoutContext } from "../providers/WorkoutProvider";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutScreen">;

export default function WorkoutScreen({ navigation }: Props) {
  const data = useWorkoutContext();

  return (
    <YStack padding="$4" space>
      <YStack padding="$4" borderRadius="$4" backgroundColor="gray">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$7">Workout Name</Text>
          <Stack
            padding="$1"
            borderRadius="$8"
            borderColor="black"
            borderWidth={1}
            width="$2"
            height="$2"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$5">2</Text>
          </Stack>
        </XStack>
        {
          // TODO: if desccription, render text here
        }
        <Text>
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
          cillum sint consectetur cupidatat.
        </Text>
      </YStack>
      <Text fontSize="$7">Exercises</Text>
    </YStack>
  );
}
