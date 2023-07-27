import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { addCartItem } from "../redux/productSlice";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { REACT_APP_BASE_URL } from "@dotenv";
import { globalStyles } from "../styles/globalStyles";
import { toast } from "../utils/helpers";
import { numberWithCommas } from "../utils/helpers";


export default function Item({
  name,
  imgUrl,
  description,
  price,
  product,
  category,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const cartData = useSelector((state) => state.product?.cartItem);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const plainDesc = description.replace(/<[^>]+>/g, "");
  // const { width } = useWindowDimensions();

  function closeModal() {
    setModalOpen(false);
  }

  const handleAddCartProduct = () => {
    const currentCartItem = {
      _id: product._id,
      name,
      price,
      category,
      image: imgUrl,
      qty: quantity,
    };
    dispatch(addCartItem(currentCartItem));
    const mutableCartData = [...cartData];
    mutableCartData?.push({
      ...currentCartItem,
      total: price * currentCartItem.qty,
    });

    if (user?.firstName) {
      //send or update user cart database in server
      (async () => {
        try {
          const res = await fetch(
            `${REACT_APP_BASE_URL}/updatecart/${user?._id}`,
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(mutableCartData),
            }
          );
          const dataRes = await res?.json();
        } catch (err) {
          console.log(err, "unable to add/update cart to database");
          setModalOpen(false)
          toast("unable to add/update cart to database")
        }
      })();
    }

    setModalOpen(false);
  };

  return (
    <TouchableOpacity onPress={() => setModalOpen(true)}>
      <View style={styles.itemContainer}>
        <Modal visible={modalOpen} animationType="slide" transparent={true}>
          <View style={globalStyles.transparentModal}>
            <View style={styles.modalContainer}>
              <View style={styles.arrowLeft}>
                <AntDesign
                  name="arrowleft"
                  color="rgb(237,139,27)"
                  onPress={closeModal}
                  size={20}
                />
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imgUrl }}
                  style={{
                    width: "100%",
                    height: 390,
                  }}
                />
              </View>
              <View style={styles.descContainer}>
                <Text style={styles.chooseQuantityText}>choose quantity</Text>
                <View style={styles.quantityContainer}>
                  <AntDesign
                    name="minus"
                    size={24}
                    color="white"
                    onPress={() =>
                      quantity > 0 && setQuantity((prev) => prev - 1)
                    }
                  />
                  <View>
                    <Text style={styles.quantityContainerText}>{quantity}</Text>
                  </View>
                  <AntDesign
                    name="plus"
                    size={24}
                    color="white"
                    onPress={() => setQuantity((prev) => prev + 1)}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleAddCartProduct}
                  style={styles.addCartBtn}
                >
                  <Text style={styles.addCartBtnText}>Add to cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View>
          <Image
            source={{ uri: imgUrl }}
            style={{ width: "100%", height: 100 }}
          />
        </View>
        <View style={styles.desc}>
          <Text style={styles.name}>{name}</Text>
          <Text style={{ fontSize: 12 }}>{plainDesc}</Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ color: "green", fontWeight: "900" }}>₦</Text>
            <Text style={{ fontWeight: "bold" }}>{numberWithCommas(price)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: 160,
    height: 195,
    flexDirection: "column",
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "rgb(248,249,250)",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "rgb(248,249,250)",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    margin: 10,
    overflow: "hidden",
  },
  desc: {
    margin: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    alignItems: "center",
    height: "90%",
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: "rgb(255,255,255,.8)",
    borderRadius: 20,
  },
  addCartBtn: {
    backgroundColor: "rgb(237,139,27)",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
  },
  addCartBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  selectLabelText: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    width: 150,
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  quantityContainerText: {
    fontSize: 35,
    color: "white",
  },
  arrowLeft: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    marginTop: 44,
  },
  imageContainer: {
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: "100%",
  },
  descContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    color: "white",
  },
  chooseQuantityText: { fontWeight: "bold", fontSize: 22, color: "white" },
});
