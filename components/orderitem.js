import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import DeliveryComponent from "./deliverycomponent";
import { AntDesign } from "@expo/vector-icons";
import OrderItemDetails from "./orderItemdetail";
import { numberWithCommas } from "../utils/helpers";

export default function OrderItem({ elem }) {
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const closeModal = () => {
    setDeliveryModal(false);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        elem.orderStatus === "delivering"
          ? setDeliveryModal(true)
          : setDetailsModal(true)
      }
    >
      <Modal visible={detailsModal} animationType="slide">
        <View
          style={{
            ...globalStyles.container,
            backgroundColor: "rgb(254,235,228)",
          }}
        >
          <View style={styles.arrowLeftContainer}>
            <AntDesign
              name="arrowleft"
              onPress={() => setDetailsModal(false)}
              size={25}
            />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Order Details
            </Text>
          </View>
          <OrderItemDetails elem={elem} />
        </View>
      </Modal>
      <Modal visible={deliveryModal} animationType="slide" transparent={true}>
        <View
          style={{
            ...globalStyles.container,
            ...globalStyles.transparentModal,
          }}
        >
          <DeliveryComponent
            closeModal={closeModal}
            deliveryLocation={elem.deliveryLocation}
            location={elem.location}
            rider={elem.rider}
          />
        </View>
      </Modal>
      {elem && (
        <View style={globalStyles.itemContainer}>
          <View style={styles.imagesContainer}>
            {elem.cart
              ?.map((el, index) => {
                return (
                  <View
                    key={el._id}
                    style={{ position: "absolute", marginLeft: index * 20 }}
                  >
                    <Image
                      source={{ uri: el.image }}
                      style={styles.image}
                      alt={el.name}
                    />
                  </View>
                );
              })
              ?.splice(0, 6)}
          </View>

          <View style={styles.descContainer}>
            <Text style={styles.dateText}>
              {new Date(elem.createdAt.split("T")[0]).toDateString()}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: elem.orderStatus === "delivered" ? "green" : "red",
                fontSize: 13,
              }}
            >
              {elem.orderStatus}
            </Text>
            <View style={styles.amountContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 13 }}>₦</Text>
                <Text style={{ ...globalStyles.amount, fontSize: 13 }}>
                  {numberWithCommas(elem.amount)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    width: 100,
    justifyContent: "space-between",
    color: "black",
  },
  quantityContainerText: {
    borderWidth: 2,
    borderColor: "gray",
    width: 20,
    height: 20,
    textAlign: "center",
    color: "black",
  },
  arrowLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "64%",
  },
  imagesContainer: {
    position: "relative",
    width: 100,
    height: 80,
  },
  image: { width: 80, height: 80, borderRadius: 50 },
  descContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "90%",
  },
  dateText: { fontWeight: "bold", color: "black", fontSize: 11 },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
