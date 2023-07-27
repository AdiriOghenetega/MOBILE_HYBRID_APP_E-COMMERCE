import React,{useEffect} from "react"
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectCategory from "./selectcategory";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toast } from "../../utils/helpers";
import {useSelector} from "react-redux"

const Tab = createMaterialTopTabNavigator();

export default function Categories() {
  const location = useSelector((state) => state.location.currentLocation);
  const tabIcon = {
    soup: "bowl",
    rice: "rice",
    proteins: "food-drumstick",
    salad: "fruit-watermelon",
    pastry: "bread-slice",
    pizza: "pizza",
    beverages: "bottle-soda-classic",
    others: "silverware-fork-knife",
  };

  useEffect(()=>{
    if(!location){
      toast("Sorry , You have to choose restaurant closest to you before you can access the menu categories")
      return
     }
   },[location])

   if (!location) {
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="rgb(237,139,27)" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Soup" component={SelectCategory} />
      <Tab.Screen name="Rice" component={SelectCategory} />
      <Tab.Screen name="Proteins" component={SelectCategory} />
      <Tab.Screen name="Salad" component={SelectCategory} />
      <Tab.Screen name="Pastry" component={SelectCategory} />
      <Tab.Screen name="Pizza" component={SelectCategory} />
      <Tab.Screen name="beverages" component={SelectCategory} />
      <Tab.Screen name="Others" component={SelectCategory} />
    </Tab.Navigator>
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
