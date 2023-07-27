import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import bikeGuy from "../assets/bikeGuy2.gif";
import avatar from "../assets/login-animation.gif";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { locationData, distance, duration } from "../utils/locationdata";
import * as Linking from "expo-linking";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@dotenv";

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;
const LATITIDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITIDE_DELTA * ASPECT_RATIO;

export default function DeliveryComponent({
  deliveryLocation,
  closeModal,
  location,
  rider,
}) {
  const [distanceDelivery, setDistanceDelivery] = useState("");

  const [storeLocation, setStoreLocation] = useState({
    latitude: parseFloat(locationData[location]?.latitude),
    longitude: parseFloat(locationData[location]?.longitude),
    latitudeDelta: LATITIDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const mapRef = useRef();

  useEffect(() => {
    if (location) {
      setStoreLocation({
        latitude: parseFloat(locationData[location]?.latitude),
        longitude: parseFloat(locationData[location]?.longitude),
        latitudeDelta: LATITIDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [location]);

  useEffect(() => {
    if (location && storeLocation && deliveryLocation) {
      const deliverDistance =
        location &&
        distance(
          storeLocation.latitude,
          storeLocation.longitude,
          deliveryLocation.latitude,
          deliveryLocation.longitude
        );
      setDistanceDelivery(deliverDistance);
    }
  }, [deliveryLocation, storeLocation]);

  const backToShop = () => {
    closeModal();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={storeLocation}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
      >
        <Marker coordinate={storeLocation} title="Hcue Restaurant" />
        <Marker coordinate={{
              latitude:parseFloat(deliveryLocation?.latitude),
              longitude:parseFloat(deliveryLocation?.longitude),
              latitudeDelta: LATITIDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }} title="You" />
        {storeLocation && deliveryLocation && (
          <MapViewDirections
            origin={storeLocation}
            destination={{
              latitude:parseFloat(deliveryLocation?.latitude),
              longitude:parseFloat(deliveryLocation?.longitude),
              latitudeDelta: LATITIDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            apikey={GOOGLE_API_KEY}
            strokeColor="rgb(237,139,27)"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.deliveryDetails}>
        <View style={styles.deliveryDetailsSectionOne}>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>Distance</Text>
            <Text style={styles.durationText2}>
              {Math.round(parseInt(distanceDelivery))}KM
            </Text>
            <Text style={styles.durationText}>Estimated Arrival</Text>
            <Text style={styles.durationText2}>
              {duration(parseInt(distanceDelivery))} Minutes
            </Text>
            <Text style={{ fontSize: 13 }}>Your order is on it's way!</Text>
          </View>
          <View>
            <Image
              source={bikeGuy}
              alt="rider"
              style={styles.riderImageStyle}
            />
          </View>
        </View>
        <View style={styles.riderDetailsContainer}>
          <View>
            <Image
              source={rider?.image ? { uri: rider?.image } : avatar}
              alt="avatar"
              style={styles.riderImage2Style}
            />
          </View>
          <View>
            <Text style={styles.riderNameText}>{rider?.name}</Text>
            <Text style={styles.riderDesc}>Your Rider</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.riderMobile}
              onPress={() => Linking.openURL(`tel:${rider?.mobile}`)}
            >
              <FontAwesome name="phone" size={25} color="rgb(237,139,27)" />
            </TouchableOpacity>
            <TouchableOpacity onPress={backToShop} style={styles.backToShop}>
              <Octicons name="x" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "64%",
    position: "relative",
    zIndex: 0,
  },
  deliveryDetails: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 1,
    position: "relative",
    marginTop: -52,
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingVertical: 12,
    height: 300,
    alignItems: "center",
    justifyContent: "space-around",
  },
  deliveryDetailsSectionOne: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  durationContainer: { height: 90, justifyContent: "space-between" },
  durationText: { fontSize: 17 },
  durationText2: { fontSize: 20, fontWeight: "700" },
  riderImageStyle: { width: 100, height: 100 },
  riderDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgb(237,139,27)",
    width: "99%",
    alignSelf: "center",
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  riderImage2Style: { width: 70, height: 70, borderRadius: 50 },
  riderNameText: { fontSize: 13, fontWeight: "700", color: "white" },
  riderDesc: { fontSize: 12, color: "white" },
  riderMobile: {
    backgroundColor: "white",
    padding: 2,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backToShop: {
    backgroundColor: "white",
    padding: 2,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
