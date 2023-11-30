import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationRoute, RootStackParamList } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseList">;

type ExerciseItemProps = { name: string };
type Exercise = {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds
}

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
  { name: "exercise A", id: "0", duration: 20},
  { name: "exercise B", id: "1", duration: 35},
];

export default function ExerciseList({ navigation }: Props) {
  return (
    <View>
      <FlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        data={data}
        renderItem={({ item }) => <ExerciseItem name={item.name} />}
        keyExtractor={(item) => item.id}
      />
      <Button title="" onPress={() => navigation.navigate(NavigationRoute.ExerciseForm)}/>
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
