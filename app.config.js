import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }) => ({
    ...config,
    slug: 'hcue_eats',
    name: 'hcueEats',
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_API_KEY,
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
          apiKey: process.env.GOOGLE_API_KEY,
        },
      },
    },
  });