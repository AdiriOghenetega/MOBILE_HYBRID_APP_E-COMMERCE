import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { toast } from "../utils/helpers";
import { REACT_APP_BASE_URL } from "@dotenv";
import { loginRedux } from "../redux/userSlice";
import { setCartData } from "../redux/productSlice";
import { setOrderData } from "../redux/orderSlice";
import { Feather } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

export default function Login({ navigation }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const { email, password } = data;
    if (email && password) {
      setLoading(true);
      try {
        console.log("called")
        const fetchData = await fetch(`${REACT_APP_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const dataRes = await fetchData.json();
        toast(dataRes.message);
        setLoading(false);

        if (dataRes.alert) {
          dispatch(loginRedux(dataRes.data));
          dispatch(setCartData(dataRes.cart));
          dispatch(setOrderData(dataRes.orderList));
          setTimeout(() => {
            navigation.navigate("Home");
          }, 1000);
        }
      } catch (error) {
        console.log(error, "error encountered during login");
        setLoading(false);
        toast("Error encountered during login,try again");
      }
    } else {
      alert("Please Enter required fields");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/login-animation.gif")}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View style={{ width: "100%" }}>
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="email"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      email: text.toLowerCase(),
                    };
                  })
                }
                value={data.email}
              />
            </View>
            <View style={globalStyles.passwordContainer}>
              <TextInput
                style={globalStyles.passwordTextInput}
                placeholder="password"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      password: text,
                    };
                  })
                }
                secureTextEntry={showPassword ? false : true}
                value={data.password}
              />
              {showPassword ? (
                <Feather
                  name="eye-off"
                  size={20}
                  color="black"
                  onPress={() => setShowPassword(false)}
                />
              ) : (
                <Feather
                  name="eye"
                  size={20}
                  color="black"
                  onPress={() => setShowPassword(true)}
                />
              )}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          {loading ? (
            <ActivityIndicator size="large" color="rgb(237,139,27)" />
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Button
                color="rgb(237,139,27)"
                title="login"
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
        <View style={styles.signupContainer}>
          <Text style={{}}> Don't have account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    paddingLeft: 32,
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    width: "100%",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 15,
    borderRadius: 6,
    color: "gray",
    marginVertical: 5,
    width: "90%",
  },
  sectionText: {
    fontWeight: "bold",
    marginVertical: 5,
  },
  avatarContainer: { borderRadius: 50, overflow: "hidden" },
  signupContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  signupText: {
    color: "rgb(237,139,27)",
    textDecorationLine: "underline",
  },
});
