import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import OrderItem from "../components/orderitem";
import { globalStyles } from "../styles/globalStyles";
import { Foundation } from "@expo/vector-icons";
import { REACT_APP_BASE_URL } from "@dotenv";
import { toast } from "../utils/helpers";
import { setOrderData } from "../redux/orderSlice";

export default function OrderList() {
  const orderList = useSelector((state) => state.order.orderList);
  const user = useSelector((state) => state.user);
  const guest = useSelector((state) => state.guest);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const reversedOrderList = [...orderList]?.reverse()

  const handleOrderListRefresh = async () => {
    if (user?.email || guest?.email) {
      try {
        setLoading(true);
        const fetchOrderList = await fetch(
          `${REACT_APP_BASE_URL}/getclientorders?email=${
            user.email ? user.email : guest.email
          }`
        );
        const res = await fetchOrderList.json();
        if (res) {
          dispatch(setOrderData(res.data));
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast("An error occured while retrieving order data, try again");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ ...globalStyles.topText, ...styles.subContainer }}>
        <Text style={styles.titleText}>Your Orders</Text>
        {loading ? (
          <ActivityIndicator size="large" color="rgb(237,139,27)" />
        ) : (
          <Foundation
            name="refresh"
            size={29}
            color="rgb(237,139,27)"
            onPress={handleOrderListRefresh}
          />
        )}
      </View>
      <FlatList
        data={reversedOrderList}
        renderItem={({ item }) => <OrderItem key={item._id} elem={item} />}
        keyExtractor={(item) => item._id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(237,139,27)",
  },
});
