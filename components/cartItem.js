import {
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  deleteCartItem,
  increaseQty,
  decreaseQty,
} from "../redux/productSlice";
import { AntDesign } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { numberWithCommas } from "../utils/helpers";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <View>
      {item && (
        <View style={globalStyles.itemContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cartImage}
            alt={item.name}
          />
          <View style={styles.cartDesc}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={globalStyles.naira}>₦</Text>
              <Text style={globalStyles.amount}>{numberWithCommas(item.total)}</Text>
            </View>
          </View>
          <View style={styles.cartDesc}>
            <View style={styles.delete}>
              <AntDesign
                name="delete"
                size={15}
                color="rgb(237,139,27)"
                onPress={() => dispatch(deleteCartItem(item._id))}
              />
            </View>
            <View style={styles.quantityContainer}>
              <AntDesign
                name="minus"
                size={20}
                color="black"
                onPress={() => dispatch(decreaseQty(item._id))}
              />
              <Text style={styles.quantityContainerText}>{item.qty}</Text>
              <AntDesign
                name="plus"
                size={20}
                color="black"
                onPress={() => dispatch(increaseQty(item._id))}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  cartDesc: {
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
  itemName: { fontWeight: "bold", fontSize: 15, color: "black", maxWidth: 90 },
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
  delete: { width: "100%", alignItems: "flex-end" },
});
