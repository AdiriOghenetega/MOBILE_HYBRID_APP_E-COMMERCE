export const locationData = {
  Abuloma: {
    latitude: "4.784309124310273",
    longitude: "7.03845983730653",
  },
  Rumuodara: {
    latitude: "4.85904914134508",
    longitude: "7.030403571789514",
  },
  Phrc: {
    latitude: "4.764730722194961",
    longitude: "7.099653337306432",
  },
};

export const distance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the difference between the two latitudes and longitudes
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Calculate the square of half the chord length between the points
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  // Calculate the angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance in kilometers
  const distance = earthRadius * c;

  return distance;
};

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export const duration = (km) => {
  //given that a motocycle travels and average of 24km/hr
  result = (km / 24) * 60;
  return result;
};

export const deliveryCharge = (km) => {
  //minimun delivery charge is NGN500
  //NGN250 per km
  const result = km * 250;
  if (result < 500) {
    return 500;
  } else {
    return result;
  }
};
