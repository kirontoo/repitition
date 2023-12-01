import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationRoute, RootStackParamList } from "./types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseList">;

type ExerciseItemProps = { name: string };
type Exercise = {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds
};

const ExerciseItem = ({ name }: ExerciseItemProps) => (
  <View
    style={{
      padding: 4,
      paddingVertical: 6,
      backgroundColor: "#85959b",
      borderRadius: 2,
      marginVertical: 2,
    }}
  >
    <Text style={{ fontSize: 20 }}>{name}</Text>
  </View>
);

const data: Exercise[] = [
  { name: "exercise A", id: "0", duration: 20 },
  { name: "exercise B", id: "1", duration: 35 },
];

export default function ExerciseList({ navigation }: Props) {
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
        renderItem={({ item }) => <ExerciseItem name={item.name} />}
        keyExtractor={(item) => item.id}
      />
      <View
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
          title="Add New Exercise"
          onPress={() => navigation.navigate(NavigationRoute.ExerciseForm)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
