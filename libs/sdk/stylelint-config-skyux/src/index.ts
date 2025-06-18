export default {
  extends: ['stylelint-config-recommended-scss'],
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-sky-selectors': true,
  },
};
