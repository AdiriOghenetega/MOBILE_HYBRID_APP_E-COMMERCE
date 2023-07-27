import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import Item from "../components/item";
import { globalStyles } from "../styles/globalStyles";
import { toast } from "../utils/helpers";

export default function Menu() {
  const productsList = useSelector((state) => state.product.productList);
  const location = useSelector((state) => state.location.currentLocation);
  const [filteredProducts, setFilteredProducts] = useState(productsList);

  useEffect(() => {
    if (!location) {
      toast(
        "Sorry , You have to choose restaurant closest to you before you can access the menu"
      );
      return;
    } else {
      setFilteredProducts(productsList);
    }
  }, [location]);

  if (!productsList || productsList?.length <= 0) {
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="rgb(237,139,27)" />
      </View>
    );
  }

  const localDishes = productsList.filter(
    (el) => el.category.toLowerCase() === "soup"
  );

  const snacksAndPastries = productsList.filter(
    (el) =>
      el.category.toLowerCase() === "pastry" ||
      el.category.toLowerCase() === "pizza"
  );

  const continentalDishes = productsList.filter(
    (el) =>
      (el.category.toLowerCase() === "rice" &&
        el._id === "6485e67ac0be913b526600cb") ||
      el.category.toLowerCase() === "salad"
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.snacksAndPastries}>
        <Text style={styles.snacksAndPastriesText}>Snacks And Pastries</Text>
        <ScrollView horizontal={true}>
          {snacksAndPastries.map((item) => {
            return (
              <Item
                name={item.name}
                description={item.description}
                imgUrl={item.image}
                price={item.price}
                category={item.category}
                product={item}
                key={item._id}
              />
            );
          })}
        </ScrollView>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Meal"
            placeholderTextColor="rgb(237,139,27)"
            onChangeText={(text) => {
              setFilteredProducts(
                productsList?.filter((product) =>
                  product.name.toLowerCase().includes(text.toLowerCase())
                )
              );
            }}
            style={globalStyles.input}
          />
        </View>
      </TouchableWithoutFeedback>
      <ScrollView>
        <View style={styles.verticalScrollContainer}>
          {filteredProducts.map((item) => {
            return (
              <Item
                name={item.name}
                description={item.description}
                imgUrl={item.image}
                price={item.price}
                category={item.category}
                product={item}
                key={item._id}
              />
            );
          })}
        </View>
      </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  snacksAndPastries: {
    height: 250,
    paddingVertical: 15,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "rgb(244,245,247)",
    marginTop: 2,
  },
  snacksAndPastriesText: {
    fontWeight: "bold",
    fontSize: 17,
    paddingLeft: 10,
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
  },
  verticalScrollContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent:"center"
  },
});
