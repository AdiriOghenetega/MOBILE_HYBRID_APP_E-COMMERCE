import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

export default function Header({ navigation, route }) {
  const cartList = useSelector((state) => state.product.cartItem);
  const user = useSelector((state) => state.user);
  const location = useSelector((state) => state.location.currentLocation);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              source={require("../assets/hcue_logo.png")}
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.nav,
            justifyContent: location ? "space-around" : "flex-end",
          }}
        >
          {location && (
            <View style={styles.cartContainer}>
              <FontAwesome
                name="shopping-cart"
                size={24}
                style={{ marginRight: 20, color: "black" }}
                onPress={() => navigation.navigate("Cart")}
              />
              <Text style={styles.cartCounter}>{cartList?.length}</Text>
            </View>
          )}
          <View
            style={{ borderRadius: 50, overflow: "hidden", marginRight: 4 }}
          >
            <TouchableOpacity
              onPress={() => !user?.firstName && navigation.navigate("Login")}
            >
              <Image
                source={
                  user?.image
                    ? { uri: user?.image }
                    : require("../assets/login-animation.gif")
                }
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Constants.statusBarHeight + 50,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 17,
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 40,
  },
  cartContainer: {
    flexDirection: "row",
  },
  nav: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "25%",
  },
  cartCounter: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    left: 17,
    bottom: 10,
    backgroundColor: "rgb(237,139,27)",
    width: 20,
    height: 20,
    textAlign: "center",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  cartCounterLoading: {
    position: "absolute",
    color: "rgb(237,139,27)",
  },
});
