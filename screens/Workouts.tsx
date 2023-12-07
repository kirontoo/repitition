import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, FlatList } from "react-native";
import { NavigationRoute, RootStackParamList } from "./types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, Button } from 'tamagui';
import data from '../data.json';

const WorkoutData: Workout[] = data;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type ItemProps = { name: string };

const Item = ({ name }: ItemProps) => (
  <Stack>
    <Text style={{ fontSize: 20 }}>{name}</Text>
  </Stack>
);

export default function WorkoutsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      spaceDirection="vertical"
      f={1}
      fd="column"
      justifyContent="space-between"
      alignItems="flex-start"
      style={{
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 16,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      }}
    >
      <FlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        data={WorkoutData}
        renderItem={({ item }) => <Item name={item.name} />}
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
    </Stack>
  );
}
