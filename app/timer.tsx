import { Text, XStack, YStack, useTheme, Button } from "tamagui";
import { Stack } from "expo-router";
import useTimer from "../hooks/useTimer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";

export default function TimerScreen() {
  const timer = useTimer(30 * 1000);
  const inset = useSafeAreaInsets();
  const theme = useTheme();

  // TODO:
  const formatToMinAndSec = (init: number): string => {
    return "";
  };

  const calcTimerPercentage = (initTimer: number): number => {
    return (timer.currentTime / initTimer) * 100;
  }

  return (
    <YStack
      padding="$2"
      paddingTop={inset.top}
      paddingBottom={inset.bottom}
      alignItems="center"
      justifyContent="space-between"
      height="100%"
    >
      <Stack.Screen options={{ title: "timer", headerShown: false }} />
      <XStack justifyContent="flex-end" width="100%" marginTop="$1">
        <Button unstyled variant="outlined">
          <MaterialIcons name="more-vert" size={16} color={theme.color.val} />
        </Button>
      </XStack>

      <YStack alignItems="center" justifyContent="center" space="$4">
        <AnimatedCircularProgress
          size={200}
          width={8}
          tintColor={theme.color8.val}
          fill={calcTimerPercentage(30 * 1000)}
          onAnimationComplete={() => console.log("onAnimationComplete")}
        >
          {() => <Text fontSize="$10">{timer.currentTime / 1000}</Text>}
        </AnimatedCircularProgress>
        {timer.isPaused ? (
          <Button circular onPress={timer.unpause}>
            <MaterialIcons
              name="play-arrow"
              size={16}
              color={theme.color.val}
            />
          </Button>
        ) : (
          <Button circular onPress={timer.pause}>
            <MaterialIcons name="pause" size={16} color={theme.color.val} />
          </Button>
        )}
      </YStack>

      <XStack
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        marginBottom="$2"
      >
        <Text fontSize="$5">2/10</Text>
        <Button variant="outlined" size="$2" unstyled>
          <MaterialIcons name="skip-next" size={20} color={theme.color.val} />
        </Button>
      </XStack>
    </YStack>
  );
}
