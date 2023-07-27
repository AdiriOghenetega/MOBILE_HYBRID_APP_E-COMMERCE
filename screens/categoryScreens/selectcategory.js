import { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Item from "../../components/item";
import { globalStyles } from "../../styles/globalStyles";

export default function SelectCategory({ route }) {
  const productsList = useSelector((state) => state.product.productList);

  const [filteredProducts, setFilteredProducts] = useState("");

  const { name } = route;

  useEffect(() => {
    setFilteredProducts(
      productsList?.filter((product) =>
        product?.category?.toLowerCase().includes(name?.toLowerCase())
      )
    );
  }, []);
  return (
    <View style={styles.container}>
      <Text style={globalStyles.topText}>{name}</Text>
      <ScrollView>
        <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
          {filteredProducts &&
            filteredProducts.map((item) => {
              return (
                <Item
                  name={item.name}
                  description={item.description}
                  imgUrl={item.image}
                  price={item.price}
                  product={item}
                  key={item._id}
                />
              );
            })}
        </View>
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
});
