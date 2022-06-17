module.exports = {
    project: {
        ios: {},
        android: {},
    },
    assets: ['./assets/fonts'],
    fonts: {
  ...Platform.select({
    ios: {
      Gilroy: 'Gilroy-Bold.ttf',
    },
    android: {
      Gilroy: 'Gilroy-Bold.ttf',
    },
  }),
},
};