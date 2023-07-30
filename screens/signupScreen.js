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
  ScrollView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { toast } from "../utils/helpers";
import { REACT_APP_BASE_URL } from "@dotenv";
import { globalStyles } from "../styles/globalStyles";

export default function SignUp({ navigation }) {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [signUpImage, setSignUpImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });

        if (!result.canceled) {
          setSignUpImage(result.assets[0].uri);
          setData((prev) => {
            return {
              ...prev,
              image: result.assets[0].uri,
            };
          });
        }
      }
    } catch (error) {
      console.log(error, "unable to upload image");
      toast("Unable to upload image,try again");
    }
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      address,
      mobile,
    } = data;
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      address &&
      mobile
    ) {
      if (password === confirmPassword) {
        setLoading(true);
        const formData = new FormData();

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("mobile", mobile);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("image", {
          name: new Date() + "_image",
          uri: data.image,
          type: "image/jpg",
        });

        try {
          const fetchData = await fetch(`${REACT_APP_BASE_URL}/mobilesignup`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          });

          const dataRes = await fetchData.json();

          toast(dataRes.message);
          setLoading(false);
          setData({
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            address: "",
            password: "",
            confirmPassword: "",
            image: "",
          });
          if (dataRes.alert) {
            navigation.navigate("Login");
          }
        } catch (error) {
          console.log(error, "an error occured during signup");
          setLoading(false);
          toast("An error occured during signup,try again");
        }
      } else {
        toast("password and confirm password does not match");
      }
    } else {
      toast("Please Enter required fields");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView>
        <View style={styles.form}>
          <View style={globalStyles.avatarParentContainer}>
          <View style={globalStyles.avatarContainer}>
            <Image
              source={
                data?.image
                  ? { uri: signUpImage }
                  : require("../assets/login-animation.gif")
              }
              style={{ width: 80, height: 80 }}
            />
            <TouchableOpacity
              style={styles.pickImageTouchable}
              onPress={pickImage}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>
          </View>
          <View style={{ width: "100%", marginTop: 20 }}>
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="first name"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      firstName: text,
                    };
                  })
                }
                value={data.firstName}
              />
            </View>
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="last name"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      lastName: text,
                    };
                  })
                }
                value={data.lastName}
              />
            </View>
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
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="mobile"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      mobile: text,
                    };
                  })
                }
                value={data.mobile}
              />
            </View>
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="address"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      address: text,
                    };
                  })
                }
                value={data.address}
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
            <View style={globalStyles.passwordContainer}>
              <TextInput
                style={globalStyles.passwordTextInput}
                placeholder="confirm password"
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      confirmPassword: text,
                    };
                  })
                }
                secureTextEntry={showConfirmPassword ? false : true}
                value={data.confirmPassword}
              />
              {showConfirmPassword ? (
                <Feather
                  name="eye-off"
                  size={20}
                  color="black"
                  onPress={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Feather
                  name="eye"
                  size={20}
                  color="black"
                  onPress={() => setShowConfirmPassword(true)}
                />
              )}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          {loading ? (
            <ActivityIndicator size="large" color="rgb(237,139,27)" />
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Button
                color="rgb(237,139,27)"
                title="Sign Up"
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
        </ScrollView>
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
    paddingTop:20
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
  pickImageTouchable: {
    position: "absolute",
    height: "50%",
    width: "100%",
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(255,255,255,.5)",
  },
});
