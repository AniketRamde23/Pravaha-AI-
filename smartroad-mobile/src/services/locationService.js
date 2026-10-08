import * as Location from 'expo-location';

// Default fallback coordinates (Hyderabad ORR highway breakdown corridor)
export const DEFAULT_COORDINATES = {
  latitude: 17.5472,
  longitude: 78.2173,
  address: 'Near ORR Exit, Dundigal - Gandimaisamma, Hyderabad',
};

export const getCurrentDeviceLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        ...DEFAULT_COORDINATES,
        isSimulated: true,
        permissionDenied: true,
      };
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    // Reverse geocode to human readable address
    let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    try {
      const rev = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (rev && rev.length > 0) {
        const item = rev[0];
        const parts = [
          item.name,
          item.street,
          item.district || item.subregion,
          item.city,
        ].filter(Boolean);
        if (parts.length > 0) {
          address = parts.join(', ');
        }
      }
    } catch (e) {
      // keep coordinates as address
    }

    return {
      latitude,
      longitude,
      address,
      isSimulated: false,
    };
  } catch (error) {
    console.warn('GPS location retrieval fallback:', error);
    return {
      ...DEFAULT_COORDINATES,
      isSimulated: true,
      error: error.message,
    };
  }
};
