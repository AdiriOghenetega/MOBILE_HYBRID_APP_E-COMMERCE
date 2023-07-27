import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { SimpleLineIcons } from "@expo/vector-icons";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "../utils/helpers";

export default function Account({ navigation }) {
  const user = useSelector((state) => state.user);
  const location = useSelector((state) => state.location.currentLocation);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderList")}
          style={styles.navigateContainer}
        >
          <Text style={{ fontSize: 17 }}>Your Orders</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => location ? navigation.navigate("Cart"):toast("choose restaurant location to view cart")}
          style={styles.navigateContainer}
        >
          <Text style={{ fontSize: 17 }}>Your Cart</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>

        {user?.firstName ? (
          <TouchableOpacity
            onPress={() => {
              dispatch(logoutRedux());
              toast("Logout successfully");
            }}
          >
            <View style={styles.logoutLoginContainer}>
              <SimpleLineIcons name="logout" size={15} color="white" />
              <Text style={styles.logoutLoginText}>Logout</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginTouchable}
          >
            <View style={styles.logoutLoginContainer}>
              <SimpleLineIcons name="login" size={15} color="white" />
              <Text style={styles.logoutLoginText}>Login</Text>
            </View>
          </TouchableOpacity>
        )}
        {!user?.firstName && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={styles.signupTouchable}
          >
            <View style={styles.signupTextContainer}>
              <Text style={styles.signupText}>Signup</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  navigateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 20,
    width: 330,
  },
  logoutLoginContainer: {
    backgroundColor: "rgb(237,139,27)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 100,
    borderRadius: 20,
    flexDirection: "row",
  },
  logoutLoginText: {
    fontWeight: "bold",
    color: "white",
    marginLeft: 4,
  },
  loginTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  signupTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  signupTextContainer: {
    backgroundColor: "rgb(237,139,27)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 100,
    borderRadius: 20,
  },
  signupText: {
    color: "black",
    fontWeight: "bold",
    color: "white",
  },
});
