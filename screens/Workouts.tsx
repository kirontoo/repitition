import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View, Button, SafeAreaView, FlatList } from "react-native";
import { RootStackParamList } from "./types";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type ItemProps = { title: string };
type Item = {
  title: string;
  id: string;
};

const Item = ({ title }: ItemProps) => (
  <View
    style={{
      padding: 4,
      paddingVertical: 6,
      backgroundColor: "#85959b",
      borderRadius: 2,
      marginVertical: 2,
    }}
  >
    <Text style={{ fontSize: 20 }}>{title}</Text>
  </View>
);

const data: Item[] = [
  { title: "workout A", id: "0" },
  { title: "workout B", id: "1" },
];

export default function WorkoutsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start",

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
        data={data}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
      <View style={{
        flex: 0,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        gap: 16,
        width: "100%"
      }}>
      <Button
        title="Create New Workout"
        onPress={() => navigation.navigate("NewWorkout")}
      />
      </View>
    </View>
  );
}
