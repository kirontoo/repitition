import { NavigationContainer } from '@react-navigation/native';
import { NavigationRoute } from './screens/types';
import WorkoutsScreen from './screens/Workouts';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from './screens/Details';
import WorkoutFormScreen from './screens/WorkoutForm';
import WorkoutScreen from './screens/Workout';
import { SafeAreaProvider } from "react-native-safe-area-context";
import ExerciseForm from './screens/ExerciseForm';
import ExerciseList from './screens/ExerciseList';
import { Theme, TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { WorkoutProvider } from './providers/WorkoutProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded])

  if (!loaded) {
    return null;
  }
  return (
    <TamaguiProvider config={config}>
      <Theme name="dark">
        <SafeAreaProvider>
          <WorkoutProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name={NavigationRoute.Home} component={WorkoutsScreen}
                  options={{
                    title: 'My Workouts',
                  }} />
                <Stack.Screen name={NavigationRoute.Details} component={DetailsScreen} />
                <Stack.Screen name={NavigationRoute.WorkoutForm} component={WorkoutFormScreen} />
                <Stack.Screen name={NavigationRoute.ExerciseForm} component={ExerciseForm} />
                <Stack.Screen name={NavigationRoute.ExerciseList} component={ExerciseList} />
                <Stack.Screen name={NavigationRoute.WorkoutScreen} component={WorkoutScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </WorkoutProvider>
        </SafeAreaProvider>
      </Theme>
    </TamaguiProvider>
  )
}
