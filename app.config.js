import { GOOGLE_API_KEY } from "dotenv";


export default ({ config }) => ({
    ...config,
    slug: 'hcue_eats',
    name: 'hcueEats',
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: GOOGLE_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/splash.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.hcueeats.app',
      googleServicesFile:process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMaps: {
          apiKey: GOOGLE_API_KEY,
        },
      },
    },
  });