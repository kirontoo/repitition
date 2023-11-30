import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import WorkoutsScreen from './screens/Workouts';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from './screens/Details';
import NewWorkoutScreen from './screens/NewWorkout';
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Home" component={WorkoutsScreen}
            options={{
              title: 'My Workouts',
            }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
