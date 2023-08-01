import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Home from "./screens/homeScreen";
import Menu from "./screens/menuScreen";
import Categories from "./screens/categoryScreens";
import Cart from "./screens/cartScreen";
import Account from "./screens/accountScreen";
import Header from "./components/header";
import Login from "./screens/loginScreen";
import SignUp from "./screens/signupScreen";
import MyTabBar from "./components/tabBar";
import OrderList from "./screens/orderListScreen";
import { LogBox } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from "@dotenv"

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  `Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead`,
  "Calling getExpoPushTokenAsync without specifying a projectId is deprecated and will no longer be supported in SDK 49+",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45."
]);

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const tabIcon = {
    home: "home",
    menu: "food-outline",
    categories: "store-search",
    orders: "menu-open",
    account: "dots-horizontal",
  };

  return (
    <RootSiblingParent>
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={({ route, navigation }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = tabIcon[route.name.toLowerCase()];

                // You can return any component that you like here!
                return (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color="rgb(237,139,27)"
                  />
                );
              },
              tabBarIndicatorStyle: {
                backgroundColor: "rgb(163,237,128)",
                height: 5,
              },
              tabBarShowLabel: true,
            })}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={({ route, navigation }) => ({
                header: () => <Header navigation={navigation} route={route} />,
                headerStyle: {
                  height: 80,
                  width: 80,
                },
              })}
            />
            <Tab.Screen
              name="Menu"
              component={Menu}
              options={({ route, navigation }) => ({
                header: () => <Header navigation={navigation} route={route} />,
                headerStyle: {
                  height: 80,
                  width: 80,
                },
              })}
            />
            <Tab.Screen
              name="Categories"
              component={Categories}
              options={({ route, navigation }) => ({
                header: () => <Header navigation={navigation} route={route} />,
                headerStyle: {
                  height: 80,
                  width: 80,
                },
              })}
            />
            <Tab.Screen name="Account" component={Account} />
            <Tab.Screen
              name="Cart"
              component={Cart}
              options={({ route, navigation }) => ({
                header: () => <Header navigation={navigation} route={route} />,
                headerStyle: {
                  height: 80,
                  width: 80,
                },
              })}
            />
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Signup" component={SignUp} />
            <Tab.Screen name="OrderList" component={OrderList} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
