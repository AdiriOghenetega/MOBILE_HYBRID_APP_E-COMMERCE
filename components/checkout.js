import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { globalStyles } from "../styles/globalStyles";
import { numberWithCommas } from "../utils/helpers";

export default function Checkout({
  totalQty,
  totalPrice,
  subTotal,
  vat,
  logistics,
  handlePayment,
  loading,
}) {
  const [checkoutFormData, setCheckoutFormData] = useState({
    // Customer details
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    address: "",
  });
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView>
        {!user?.firstName && (
          <View style={styles.inPutContainer}>
            <Text style={styles.sectionText}>Customer Information</Text>
            <View style={{ paddingHorizontal: 10 }}>
              <View>
                <TextInput
                  style={globalStyles.formInput}
                  placeholder="firstName"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setCheckoutFormData((prev) => {
                      return {
                        ...prev,
                        firstName: text,
                      };
                    })
                  }
                  value={checkoutFormData.firstName}
                />
              </View>
              <View>
                <TextInput
                  style={globalStyles.formInput}
                  placeholder="lastName"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setCheckoutFormData((prev) => {
                      return {
                        ...prev,
                        lastName: text,
                      };
                    })
                  }
                  value={checkoutFormData.lastName}
                />
              </View>
              <View>
                <TextInput
                  style={globalStyles.formInput}
                  placeholder="mobile"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setCheckoutFormData((prev) => {
                      return {
                        ...prev,
                        mobile: text,
                      };
                    })
                  }
                  value={checkoutFormData.mobile}
                />
              </View>
              <View>
                <TextInput
                  style={globalStyles.formInput}
                  placeholder="email"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setCheckoutFormData((prev) => {
                      return {
                        ...prev,
                        email: text.toLowerCase(),
                      };
                    })
                  }
                  value={checkoutFormData.email}
                />
              </View>
              <View>
                <TextInput
                  style={globalStyles.formInput}
                  placeholder="address"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setCheckoutFormData((prev) => {
                      return {
                        ...prev,
                        address: text,
                      };
                    })
                  }
                  value={checkoutFormData.address}
                />
              </View>
            </View>
          </View>
        )}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.summary}>Summary</Text>
          <View
            style={{
              ...styles.inPutContainer,
              marginTop: 17,
            }}
          >
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionText}>Vat:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 17 }}>₦</Text>
                <Text style={styles.summarySectionText}>{numberWithCommas(Math.ceil(vat))}</Text>
              </View>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionText}>Delivery Charge:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 17 }}>₦</Text>
                <Text style={styles.summarySectionText}>
                  {numberWithCommas(Math.ceil(logistics))}
                </Text>
              </View>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionText}>subTotal:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 17 }}>₦</Text>
                <Text style={styles.summarySectionText}>
                  {numberWithCommas(Math.ceil(subTotal))}
                </Text>
              </View>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionText}>TotalQty:</Text>
              <Text style={styles.summarySectionText}>{totalQty}</Text>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionText}>Total Price:</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...globalStyles.naira, fontSize: 17 }}>₦</Text>
                <Text style={styles.summarySectionText}>{numberWithCommas(totalPrice)}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color="rgb(237,139,27)" />
          ) : (
            <View style={globalStyles.buttonContainer}>
              <Button
                color="red"
                title="Proceed to payment"
                onPress={() => {
                  handlePayment(checkoutFormData);
                }}
              />
            </View>
          )}
        </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: "100%",
    justifyContent: "center",
    flex:1
  },
  inPutContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  sectionText: {
    fontWeight: "bold",
    marginVertical: 5,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  summary: {
    backgroundColor: "rgb(237,139,27)",
    color: "white",
    width: "100%",
    padding: 17,
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  summarySectionText: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
