import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MyTabBar({ state, descriptors, navigation }) {
  const tabIcon = {
    home: "home",
    menu: "food-outline",
    categories: "store-search",
    orders: "menu-open",
    account: "dots-horizontal",
  };

  const myBars = state?.routes.filter(
    (route) =>
      route.name.toLowerCase() === "home" ||
      route.name.toLowerCase() === "menu" ||
      route.name.toLowerCase() === "categories" ||
      route.name.toLowerCase() === "account"
  );
  return (
    <View style={{ flexDirection: "row" }}>
      {myBars.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.key}
            style={styles.tabContainer}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={tabIcon[label.toLowerCase()]}
                size={29}
                color={isFocused ? "rgb(237,139,27)" : "black"}
              />
              <Text style={{ color: isFocused ? "rgb(237,139,27)" : "black",fontSize:11 }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  tabContainer:{
    flex: 1,
    height: 90,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(254,235,228)",
    paddingTop: 23,
  }
})