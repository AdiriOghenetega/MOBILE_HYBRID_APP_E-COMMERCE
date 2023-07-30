import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Button,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/cartItem";
import { globalStyles } from "../styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { setCartData } from "../redux/productSlice";
import { toast } from "../utils/helpers";
import { setOrderData, setCurrentOrderData } from "../redux/orderSlice";
import { WebView } from "react-native-webview";
import { REACT_APP_BASE_URL,GOOGLE_API_KEY } from "@dotenv";
import Checkout from "../components/checkout";
import { locationData, distance, deliveryCharge } from "../utils/locationdata";
import Address from "../components/chooseaddress";
import loader from "../assets/delivery.gif";
import { deliveryLocationRedux } from "../redux/locationSlice";
import { addGuestRedux } from "../redux/guestSlice";
import OrderPending from "../components/orderpending";
import { numberWithCommas } from "../utils/helpers";


Location.setGoogleApiKey(GOOGLE_API_KEY);

export default function Cart({ navigation }) {
  const dispatch = useDispatch();
  const cartList = useSelector((state) => state.product.cartItem);
  const user = useSelector((state) => state.user);
  const location = useSelector((state) => state.location.currentLocation);
  const deliveryLocation = useSelector(
    (state) => state.location?.deliveryLocation
  );
  const expoPushToken = useSelector((state) => state.pushToken.expoPushToken);

  console.log(expoPushToken);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [orderPendingModal, setOrderPendingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState("");
  const [distanceDelivery, setDistanceDelivery] = useState("");
  const [customerLocation, setCustomerLocation] = useState({
    latitude: parseFloat(locationData[location]?.latitude),
    longitude: parseFloat(locationData[location]?.longitude),
  });
  const [reversedGeo, setReversedGeo] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (location && customerLocation) {
      const deliverDistance =
        location &&
        distance(
          locationData[location]?.latitude,
          locationData[location]?.longitude,
          customerLocation.latitude,
          customerLocation.longitude
        );
      setDistanceDelivery(deliverDistance);
    }
    reverseGeoCode();
  }, [customerLocation, location]);

  const preciseUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setAddressModal(false);
        toast(
          "Permission to access location was denied,change permission in settings"
        );
        return;
      }
      setLoadingModal(true);
      setTimeout(() => setAddressModal(false), 2000);

      let location = await Location.getCurrentPositionAsync({});

      setCustomerLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      dispatch(
        deliveryLocationRedux({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      );
      setLoadingModal(false);
    } catch (error) {
      console.log(error);
      setLoadingModal(false);
      toast("There was an error choosing delivery location,Try again...")
    }
  };

  const userLocation = (address) => {
      setLoadingModal(true);
      setAddressModal(false);
      // console.log(address);
      setCustomerLocation({
        latitude: address.latitude,
        longitude: address.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      dispatch(
        deliveryLocationRedux({
          latitude: address.latitude,
          longitude: address.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      );
      setLoadingModal(false);
   
  };

  const reverseGeoCode = async () => {
    try {
      const getAddressFromGeo = await Location.reverseGeocodeAsync(
        {
          latitude: customerLocation.latitude,
          longitude: customerLocation.longitude,
        },
        {
          useGoogleMaps: true,
        }
      );

      setReversedGeo(getAddressFromGeo);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closePendingModal = () => {
    setOrderPendingModal(false);
  };

  const subTotal = cartList.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  //vat is 7.5%
  const vat = (7.5 / 100) * parseInt(subTotal);

  const pricePlusVat = parseInt(subTotal) + parseInt(vat);

  //delivery charge
  const logistics = deliveryCharge(parseInt(distanceDelivery));

  const totalPrice = parseInt(pricePlusVat) + parseInt(logistics);

  const totalQty = cartList.reduce((acc, curr) => acc + parseInt(curr.qty), 0);

  const handlePayment = async (guestData) => {
    try {
      if (user?.mobile || guestData?.mobile) {
        setLoading(true);
        const res = await fetch(
          `${REACT_APP_BASE_URL}/payment?amount=${totalPrice}&email=${
            user._id ? user.email : guestData.email
          }`
        );

        const data = await res.json();

        setGateway(data.data.authorization_url);

        const orderRes = await fetch(`${REACT_APP_BASE_URL}/createorder`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            vat,
            subTotal,
            deliveryCharge: logistics,
            amount: totalPrice,
            userID: user?._id && user._id,
            guest: guestData,
            email: user?.email && user.email,
            userType: user?._id ? "registered" : "guest",
            method: "online",
            payment_status: "pending",
            order_status: "pending",
            reference: data?.data?.reference,
            cartData: cartList,
            location: location,
            deliveryLocation: customerLocation,
            expoPushToken,
          }),
        });

        const orderData = await orderRes.json();
        console.log(orderData);
        dispatch(setOrderData(orderData.orderList));
        dispatch(setCurrentOrderData(orderData.currentOrder));
        guestData && dispatch(addGuestRedux(guestData));
        setLoading(false);
        toast("Redirect to payment Gateway...!");
        setModalOpen(false);
        setConfirmationModalOpen(true);
      } else {
        setModalOpen(false);
        toast(
          "Kindly login or provide the required details to continue purchase"
        );
      }
    } catch (error) {
      console.log(error, "an error occured while initializing payment");
      setConfirmationModalOpen(false);
      toast("Network Error,Try again");
    }
  };

  if (!cartList) {
    return (
      <View style={styles.altContainer}>
        <ActivityIndicator size="large" color="rgb(237,139,27)" />
      </View>
    );
  }

  if (cartList?.length <= 0) {
    return (
      <View style={styles.altContainer}>
        <Text style={styles.noItemsText}>
          You have no items in your shopping cart, start adding some 😊!
        </Text>
        <Button
          title="continue shopping"
          color="rgb(237,139,27)"
          onPress={() => navigation.navigate("Menu")}
        />
      </View>
    );
  }

  const callback_url = "https://hcue-frontend.vercel.app/success";

  const onNavigationStateChange = (state) => {
    const { url } = state;

    if (!url) return;

    if (url === callback_url) {
      setConfirmationModalOpen(false);
      setOrderPendingModal(true);
    }
  };

  const onLoadProgress = (event) => {
    const { url } = event.nativeEvent;

    if (!url) return;

    if (url === callback_url) {
      setConfirmationModalOpen(false);
      setOrderPendingModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={loadingModal} animationType="slide" transparent={true}>
        <View
          style={{
            ...globalStyles.container,
            ...globalStyles.transparentModal,
          }}
        >
          <View style={styles.loaderStyle}>
            <Image
              source={loader}
              alt={"loader"}
              style={{ width: 300, height: 300 }}
            />
          </View>
        </View>
      </Modal>
      <Text style={globalStyles.topText}>Your Cart</Text>
      <Modal visible={modalOpen} animationType="slide">
        <View style={globalStyles.container}>
          <View style={styles.arrowLeftContainer}>
            <AntDesign name="arrowleft" onPress={closeModal} size={25} />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Checkout</Text>
          </View>
          <Checkout
            totalQty={totalQty}
            totalPrice={totalPrice}
            subTotal={subTotal}
            vat={vat}
            logistics={logistics}
            handlePayment={handlePayment}
            loading={loading}
          />
        </View>
      </Modal>
      <Modal visible={confirmationModalOpen} animationType="slide">
        <View style={globalStyles.container}>
          <View>
            <MaterialIcons
              name="close"
              onPress={() => setConfirmationModalOpen(false)}
              size={25}
            />
          </View>
          <WebView
            style={{ ...styles.container, marginTop: 8 }}
            source={{ uri: gateway }}
            onNavigationStateChange={onNavigationStateChange}
            onLoadProgress={(event) => onLoadProgress(event)}
          />
        </View>
      </Modal>
      <Modal visible={orderPendingModal} animationType="slide">
        <View style={globalStyles.container}>
          <OrderPending
            navigation={navigation}
            closePendingModal={closePendingModal}
          />
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setAddressModal(true)}>
        <View style={styles.chooseDeliveryContainer}>
          <Text>Choose delivery address</Text>
          <AntDesign name="arrowdown" size={20} color="black" />
        </View>
        {reversedGeo && (
          <View style={styles.reversedGeoContainer}>
            <Text>
              {reversedGeo[0]?.street} {reversedGeo[0]?.city},
              {reversedGeo[0]?.region},{reversedGeo[0]?.country}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal visible={addressModal} animationType="slide">
        <View style={globalStyles.container}>
          <View>
            <MaterialIcons
              name="close"
              onPress={() => setAddressModal(false)}
              size={25}
            />
          </View>
          <Address
            userLocation={userLocation}
            preciseUserLocation={preciseUserLocation}
            customerLocation={customerLocation}
          />
        </View>
      </Modal>
      <FlatList
        data={cartList}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.desc}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.descTitle}>Delivery Fee :</Text>
          <View style={styles.deliveryChargeContainer}>
            <Text style={{ ...globalStyles.naira, fontSize: 15 }}>₦</Text>
            <Text style={{ ...styles.descTitle, fontSize: 15 }}>
              {numberWithCommas(deliveryCharge(parseInt(distanceDelivery)))}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "white",
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.subTotalContainer}>
          <View>
            <Text style={{ ...styles.descTitle, fontSize: 20 }}>Subtotal:</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...globalStyles.naira, fontSize: 20 }}>₦</Text>
              <Text style={{ ...styles.descTitle, fontSize: 20 }}>
                {numberWithCommas(subTotal)}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ ...styles.descTitle, fontSize: 20 }}>Quantity:</Text>
            <Text style={{ ...styles.descTitle, fontSize: 20 }}>
              {totalQty}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          color="rgb(237,139,27)"
          title="continue shopping"
          onPress={() => navigation.navigate("Menu")}
        />
        <Button
          color="black"
          title="checkout"
          onPress={() =>
            Object.values(deliveryLocation).length
              ? setModalOpen(true)
              : toast("Choose delivery address")
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modalContainer: {
    marginTop: 10,
    flex: 1,
  },
  loaderStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: "80%",
    width: "100%",
  },
  arrowLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "64%",
  },
  chooseDeliveryContainer: {
    width: 340,
    height: 40,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    elevation: 3,
    shadowOffset: { width: 2, height: 5 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "rgb(254,235,228)",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  desc: {
    width: "92%",
    height: 140,
    backgroundColor: "rgb(237,139,27)",
    padding: 15,
    borderRadius: 20,
    justifyContent: "space-around",
  },
  descTitle: { fontWeight: "bold", color: "white" },
  deliveryChargeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  subTotalContainer: { flexDirection: "row", justifyContent: "space-between" },
  buttonsContainer: {
    flexDirection: "row",
    paddingVertical: 30,
    paddingHorizontal: 25,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  altContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  noItemsText: {
    color: "black",
    width: "80%",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 30,
  },
  reversedGeoContainer: {
    paddingHorizontal: 10,
    marginBottom:4
  },
});
