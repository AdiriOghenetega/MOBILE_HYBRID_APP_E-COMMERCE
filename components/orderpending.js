import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import loader from "../assets/delivery.gif";
import { Octicons } from "@expo/vector-icons";
import { setCartData } from "../redux/productSlice";
import { globalStyles } from "../styles/globalStyles";
import { numberWithCommas } from "../utils/helpers";


export default function OrderPending({ navigation, closePendingModal }) {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.currentOrder);
  const backToShop = () => {
    dispatch(setCartData([]));
    closePendingModal();
    navigation.navigate("Menu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Pending</Text>
      <View>
        <Image
          source={loader}
          alt="rider"
          style={{ width: 250, height: 250 }}
        />
      </View>
      <View>
        <Text style={styles.subTitle}>Order Items</Text>
        <View style={{ height: 180 }}>
          <ScrollView style={{ height: 400 }}>
            {order?.cart?.map((item) => {
              return (
                <View key={item._id} style={styles.itemsContainer}>
                  <Text style={styles.descText}>{item.name}</Text>
                  <Text style={styles.descText}>{item.qty}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <View style={styles.amountCountainer}>
        <Text style={{ ...globalStyles.amount, fontSize: 20 }}>Total:</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ ...globalStyles.naira, fontSize: 20 }}>₦</Text>
          <Text style={{ ...globalStyles.amount, fontSize: 20 }}>
            {numberWithCommas(order.amount)}
          </Text>
        </View>
      </View>
      <View style={styles.backToShopContainer}>
        <TouchableOpacity onPress={backToShop} style={styles.backToShop}>
          <Octicons name="x" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: { fontWeight: "bold", color: "black", fontSize: 30 },
  subTitle: {
    backgroundColor: "rgb(237,139,27)",
    color: "white",
    width: 360,
    padding: 17,
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  itemsContainer: {
    width: 360,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  descText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  amountCountainer: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backToShopContainer: {
    justifyContent: "center",
    backgroundColor: "rgb(237,139,27)",
    width: 70,
    height: 70,
    alignItems: "center",
    borderRadius: 50,
    padding: 5,
    marginTop: 20,
  },
  backToShop: {
    backgroundColor: "white",
    padding: 2,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
