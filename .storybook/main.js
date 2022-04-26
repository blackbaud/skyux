module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-a11y',
    // '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    // '@storybook/addon-controls',
    // {
    //   name: '@storybook/addon-docs',
    //   options: {
    //     sourceLoaderOptions: {
    //       injectStoryParameters: false,
    //     },
    //   },
    // },
    // '@storybook/addon-storysource',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
  ],
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs
  //   // Return the altered config
  //   return config;
  // },
  core: {
    builder: 'webpack5',
  },
};
