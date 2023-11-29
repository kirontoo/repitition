import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View, Button } from "react-native";
import { RootStackParamList } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function WorkoutsScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
}
