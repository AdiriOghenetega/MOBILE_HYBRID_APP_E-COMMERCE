import React, { useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@dotenv";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITIDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITIDE_DELTA * ASPECT_RATIO;

export default function Address({
  userLocation,
  customerLocation,
  // preciseUserLocation,
}) {
  const [selectedLocation, setSelectedLocation] = useState(customerLocation);

  const handleRegionSelect = () => {
    userLocation(selectedLocation);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* <View style={styles.currentLocationContainer}>
          <TouchableOpacity onPress={preciseUserLocation}>
            <View style={styles.locationSelectSection}>
              <Text style={{ color: "white" }}>Use Current Location</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
        <Text style={styles.orText}>Or</Text>
        </View> */}
        <View>
        <Text style={styles.restaurantSelectText}>Search location</Text>
        </View>
        <View style={styles.serachLocationContainer}>
          <View style={styles.autoCompleteContainer}>
            <GooglePlacesAutocomplete
              styles={{
                textInput: styles.autocompleteInput,
              }}
              placeholder="Search"
              textInputProps={{
                placeholderTextColor: "rgb(237,139,27)",
              }}
              fetchDetails = {true}
              onPress={(data, details) => {
                // 'details' is provided when fetchDetails = true
                const { lat, lng } = details?.geometry?.location;
                setSelectedLocation({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: LATITIDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                });
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: "en",
              }}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleRegionSelect}>
          <View style={{ ...styles.locationSelectSection, marginBottom: 6 }}>
            <Text style={{ color: "white" }}>Select</Text>
          </View>
        </TouchableOpacity>
        <MapView
          style={styles.map}
          region={selectedLocation}
          provider={PROVIDER_GOOGLE}
        >
          <Marker coordinate={selectedLocation} title="You" />
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "70%",
    position: "relative",
    zIndex: 1,
    borderRadius: 10,
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  locationSelectSection: {
    backgroundColor: "rgb(237,139,27)",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  orText: {
    fontWeight: "bold",
    fontSize: 17,
    marginVertical: 4,
    textAlign: "center",
    color: "rgb(237,139,27)",
  },
  restaurantSelectText: {
    fontSize: 17,
    color: "rgb(237,139,27)",
    textAlign: "center",
  },
  autoCompleteContainer: {
    width: "100%",
    position: "absolute",
  },
  autocompleteInput: {
    borderColor: "#888",
    borderWidth: 1,
  },
  serachLocationContainer: {
    marginVertical: 6,
    alignItems: "flex-start",
    overflow: "visible",
    zIndex: 5,
    position: "relative",
    height: 45,
  },
});
