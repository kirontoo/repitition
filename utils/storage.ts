import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "repitition-workouts";

export const getLocalWorkoutData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    const data: Workout[] = jsonValue != null ? JSON.parse(jsonValue) : null;
    return data;
  } catch (e) {
    // error reading value
  }
};

export const storeLocalWorkoutData = async (value: Workout[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    // saving error
  }
};

