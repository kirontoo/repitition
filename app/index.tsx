import { Text, Button, YStack, XStack, useTheme, H1 } from "tamagui";
import { Stack, useRouter } from "expo-router";
import { FlatList } from "react-native";
import { useWorkoutContext } from "../providers/WorkoutProvider";

type WorkoutItemProps = { id: string; name: string; reps: number };

export default function HomeScreen() {
  const data = useWorkoutContext();
  const router = useRouter();

  const Item = ({ id, name, reps }: WorkoutItemProps) => (
    <Button
      key={id}
      margin="$1"
      justifyContent="flex-start"
      onPress={() => router.push({ pathname: "/workout", params: { id } })}
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
    <YStack flex={1} space="$2" padding="$2">
      <Stack.Screen options={{ title: "home", headerShown: false }} />
      <H1 fontSize="$8">Workouts</H1>

      <FlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        data={data.workouts}
        renderItem={({ item }) => <Item id={item.id} name={item.name} reps={item.reps} />}
        keyExtractor={(item) => item.id}
      />
      <YStack
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: 16,
          width: "100%",
        }}
      >
        <Button onPress={() => router.push('/workout/form/')}>Create New Workout</Button>
      </YStack>
    </YStack>
  );
}
