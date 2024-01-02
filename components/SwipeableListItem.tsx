import { Animated, StyleSheet, I18nManager } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ReactNode, useRef } from "react";
import { View, Button, useTheme } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

type SwipeableListItemProps = {
  children: ReactNode;
  swipeLeftAction: () => void;
  swipeRightAction: () => void;
};

// Swipeable Item
// Swipe right: edit item
// Swipe left: delete item
// Swipe left action: for right icon
// Swipe right action: for left icon
export default function SwipeableListItem({
  children,
  swipeRightAction,
  swipeLeftAction,
}: SwipeableListItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  // Delete Button
  const renderRightActions = (_, dragX) => {
    dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Button
        onPress={() => {
          swipeLeftAction();
          swipeableRef?.current?.close();
        }}
        style={styles.rightButton}
        backgroundColor={theme.red8}
      >
        <AnimatedIcon name="delete-outline" size={16} color={theme.color.val} />
      </Button>
    );
  };

  // Edit Button
  const renderLeftActions = (_, dragX) => {
    dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Button
        onPress={() => {
          swipeRightAction();
          swipeableRef?.current?.close();
        }}
        style={styles.leftButton}
        backgroundColor={theme.green8}
      >
        <AnimatedIcon name="edit" size={16} color={theme.color.val} />
      </Button>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      rightThreshold={80}
      leftThreshold={80}
    >
      <View display="flex" justifyContent="center">
        {children}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightButton: {
    borderRadius: 0,
    marginTop: 2,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  leftButton: {
    borderRadius: 0,
    marginTop: 2,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "flex-end",
  },
  row: {
    display: "flex",
    justifyContent: "center",
  },
});
