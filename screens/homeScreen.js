import { useState, useEffect, useRef } from "react";
import { StatusBar, setStatusBarTranslucent } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions
} from "react-native";
import { setDataProduct, setCartData } from "../redux/productSlice";
import { locationRedux } from "../redux/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import { globalStyles } from "../styles/globalStyles";
import { REACT_APP_BASE_URL } from "@dotenv";
import SelectDropdown from "react-native-select-dropdown";
import { toast } from "../utils/helpers";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { pushTokenRedux } from "../redux/pushTokenSlice";
import { setOrderData } from "../redux/orderSlice";
import * as Linking from "expo-linking";
import GreetingScreenComponent from "../components/greetingScreenComponent";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  // useNotificationObserver()
  const location = useSelector((state) => state.location?.currentLocation);
  const user = useSelector((state) => state.user);
  const guest = useSelector((state) => state.guest);

  const [ltn, setLtn] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();
  

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const closed = currentHour < 9 || currentHour >= 22;
  const locationList = ["Phrc", "Abuloma", "Rumuodara"];

  useEffect(() => {
    setTimeout(() => setIntroModalOpen(false), 3000);
  }, []);

  useEffect(() => {
    if (closed) {
      setModalOpen(true);
    }
  }, [closed]);

  useEffect(() => {
    try {
      registerForPushNotificationsAsync().then((token) =>
        dispatch(pushTokenRedux(token))
      );

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          if (
            notification.request.content.data.status === "delivering" ||
            notification.request.content.data.status === "delivered"
          ) {
            fetchOrder();
          }
        });
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
          console.log(response.notification.request.content.data);
          if (
            response.notification.request.content.data.status ===
              "delivering" ||
            response.notification.request.content.data.status === "delivered"
          ) {
            fetchOrder();
          }
        });
    } catch (error) {
      console.log(error);
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function fetchOrder() {
    if (user?.email || guest?.email) {
      try {
        const fetchOrderList = await fetch(
          `${REACT_APP_BASE_URL}/getclientorders?email=${
            user?.email ? user.email : guest.email
          }`
        );
        const res = await fetchOrderList.json();
        if (res) {
          dispatch(setOrderData(res.data));
        }
      } catch (error) {
        console.log(error);
        toast("Network Error,Unable to fetch order");
      }
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        // console.log(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      return token;
    } catch (error) {
      console.log(error);
      toast("Network Error,Unable to register push notification");
    }
  }

  const handleGo = async () => {
    if (ltn) {
      try {
        setLoading(true);
        const res = await fetch(`${REACT_APP_BASE_URL}/product`);
        const resData = await res.json();
        if (resData) {
          console.log("answered");
          const availProducts = resData.filter((el) => el.stores.includes(ltn));
          dispatch(setDataProduct(availProducts));
          if (location.toLowerCase() !== ltn.toLowerCase()) {
            dispatch(setCartData([]));
          }
          dispatch(locationRedux(ltn));
          setLoading(false);
          navigation.navigate(`Menu`);
        }
      } catch (err) {
        setLoading(false);
        toast("Network Error,Unable to retrieve product data");
        console.log(err, "unable to retrieve product data");
      }
    } else {
      toast("choose a location");
    }
  };

  return (
    <ScrollView>
      <Modal visible={introModalOpen} animationType="slide">
        <View style={globalStyles.container}>
          <GreetingScreenComponent />
        </View>
      </Modal>
      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <View
          style={{
            ...globalStyles.container,
            ...globalStyles.transparentModal,
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/storeclosed.png")}
                style={styles.image1}
                alt="store closed"
              />
            </View>
            <View>
              <Text style={styles.modalText1}>
                Sorry we are not open at this time
              </Text>
              <Text style={styles.modalText2}>
                Opening hours between 9am - 10pm
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={globalStyles.topText}>Welcome to Hcue mobile app</Text>
      <View style={{height:height - Constants.statusBarHeight - 50 -100 }}>
      <View style={styles.imageContainer2}>
        <Image
          source={require("../assets/header-bg.jpg")}
          style={styles.image2}
        />
        <View style={styles.introContainer}>
          <Text style={styles.introText1}>
            Enjoy tasty meals wherever you are
          </Text>
          <Text style={styles.introText2}>
            Select restaurant closest to you
          </Text>
          <SelectDropdown
            data={locationList}
            buttonStyle={styles.dropDownButton}
            rowTextStyle={{ color: "rgb(237,139,27)" }}
            onSelect={(selectedItem, index) => {
              setLtn(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }}
          />
          {loading ? (
            <ActivityIndicator size="large" color="rgb(237,139,27)" />
          ) : (
            <TouchableOpacity onPress={handleGo}>
              <View style={styles.goButton}>
                <Text>Go</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.imageContainer3}>
        <Image
          source={require("../assets/hcue_random_bg.jpg")}
          style={styles.image3}
        />
        <View style={styles.adContainer}>
          <Text style={styles.adText}>HAVING AN EVENT?</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${+2348142604385}`)}
            style={styles.adTouchable}
          >
            <Text style={styles.adText}>BOOK US NOW</Text>
          </TouchableOpacity>
          <Text style={styles.adText}>fast, easy and simple</Text>
        </View>
      </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    height: "60%",
    marginTop: "30%",
  },
  imageContainer: {
    shadowOffset: {
      width: 10,
      height: 10,
    },
    elevation: 10,
    shadowColor: "#333",
    backgroundColor: "#fff",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowColor: "gray",
    borderRadius: 2,
    width: 250,
    height: 250,
    overflow: "hidden",
  },
  imageContainer2: {
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  imageContainer3: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    position: "relative",
  },
  image1: { width: "100%", height: "100%" },
  image2: {
    height: "100%",
    width: "90%",
    borderRadius: 2,
    overflow: "hidden",
  },
  image3: {
    height: "100%",
    width: "90%",
    borderRadius: 2,
    overflow: "hidden",
  },
  modalText1: { color: "white", fontSize: 23 },
  modalText2: { color: "rgb(237,139,27)", fontSize: 23 },
  introContainer: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  introText1: {
    color: "rgb(237,139,27)",
    fontSize: 30,
    fontWeight: "bold",
    width: "60%",
  },
  introText2: { marginTop: 16, fontSize: 15, fontWeight: "bold" },
  dropDownButton: {
    height: 35,
    fontSize: 15,
    marginTop: 16,
    borderRadius: 10,
  },
  goButton: {
    backgroundColor: "rgb(237,139,27)",
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  adContainer: {
    position: "absolute",
    width: "80%",
    alignItems: "flex-start",
  },
  adText: { color: "white", fontSize: 20, fontWeight: "bold" },
  adTouchable: {
    backgroundColor: "black",
    padding: 15,
    marginVertical: 10,
  },
});
