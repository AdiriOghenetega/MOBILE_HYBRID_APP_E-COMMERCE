import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { numberWithCommas } from "../utils/helpers";

export default function OrderItemDetails({ elem }) {
  return (
    <View style={styles.container}>
      {elem && (
        <View style={styles.itemContainer}>
          <ScrollView>
            {elem?.cart?.map((item, index) => {
              return (
                <View style={styles.itemSubContainer} key={item._id}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 60, height: 60 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.nameText}>{item.name}</Text>
                  </View>
                  <View style={styles.desc}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color:
                          elem.orderStatus === "delivered" ? "green" : "red",
                        fontSize: 13,
                      }}
                    >
                      {elem.orderStatus}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ ...globalStyles.naira, fontSize: 13 }}>
                        ₦
                      </Text>
                      <Text
                        style={{
                          ...globalStyles.amount,
                          fontSize: 13,
                        }}
                      >
                        {numberWithCommas(item.price)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={{ padding: 50 }}>
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>Order Date:</Text>
              <Text style={styles.descTitle}>
                {new Date(elem.createdAt.split("T")[0]).toDateString()}
              </Text>
            </View>
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>Vat:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 16 }}>₦</Text>
                <Text style={styles.descTitle}>{numberWithCommas(elem.vat)}</Text>
              </View>
            </View>
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>delivery Charge:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 16 }}>₦</Text>
                <Text style={styles.descTitle}>{numberWithCommas(elem.deliveryCharge)}</Text>
              </View>
            </View>
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>subTotal</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 16 }}>₦</Text>
                <Text style={styles.descTitle}>{numberWithCommas(elem.subTotal)}</Text>
              </View>
            </View>
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>Total:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 16 }}>₦</Text>
                <Text style={styles.descTitle}>{numberWithCommas(elem.amount)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(254,235,228)",
  },
  itemContainer: {
    width: 340,
    height: "100%",
    flexDirection: "column",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  itemSubContainer: {
    width: 320,
    height: 100,
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: 2, height: 5 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 9,
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  nameText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 13,
  },
  desc: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "90%",
  },
  descSection: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descTitle: { fontWeight: "bold", color: "black", fontSize: 16 },
});
