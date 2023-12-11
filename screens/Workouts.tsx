import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { NavigationRoute, RootStackParamList } from "./types";
import { Text, Stack, Button, YStack, XStack } from "tamagui";
import { useWorkoutContext } from "../providers/WorkoutProvider";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type ItemProps = { name: string; reps: number };

export default function WorkoutsScreen({ navigation }: Props) {
  const data = useWorkoutContext();

  const Item = ({ name, reps }: ItemProps) => (
    <Button
      margin="$1"
      onPress={() => navigation.navigate(NavigationRoute.WorkoutScreen)}
      justifyContent="flex-start"
    >
      <XStack space flex={1} justifyContent="space-between" alignItems="center">
        <Text fontSize="$5">{name}</Text>
        <XStack 
          borderRadius="$6" 
          borderColor="white" 
          borderWidth={1} 
          width="$2" 
          height="$2" 
          justifyContent="center" 
          alignItems="center"
        >
          <Text>{reps}</Text>
        </XStack>
      </XStack>
    </Button>
  );

  return (
    <YStack
      flex={1}
      space="$2"
      borderWidth={2}
      borderColor="$color"
      borderRadius="$4"
      padding="$2"
    >
      <FlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        data={data.workouts}
        renderItem={({ item }) => <Item name={item.name} reps={item.reps} />}
        keyExtractor={(item) => item.id}
      />
      <Stack
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: 16,
          width: "100%",
        }}
      >
        <Button
          onPress={() => {
            navigation.navigate(NavigationRoute.WorkoutForm);
          }}
        >
          Create New Workout
        </Button>
      </Stack>
    </YStack>
  );
}
