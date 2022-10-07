module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./assets/fonts"],
  fonts: {
    ...Platform.select({
      ios: {
        Gilroy: "Gilroy-Bold.ttf",
      },
      android: {
        Gilroy: "Gilroy-Bold.ttf",
      },
    }),
  },
  dependencies: {
    "react-native-notifications": {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
