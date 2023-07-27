import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";

export default function GreetingScreenComponent() {
  const rotation = useSharedValue(0);


  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    const animationInterval = setInterval(() => {
      rotation.value = withSequence(
        withTiming(-360, { duration: 50 }),
        withRepeat(withTiming(360, { duration: 500 }), 6, true)
      );
    }, 1000);
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.box, style]}>
        <Image
          source={require("../assets/hcue_logo.png")}
          style={styles.greetingImage}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 200,
    height: 80,
    backgroundColor: "transparent",
    marginBottom: 25,
  },
  greetingImage:{ width: 200, height: 80 }
});
