# skyux-stylelint

## Install

```bash
ng add skyux-stylelint
```

## Implement in stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-deprecated-sky-scss-variables': true,
    'skyux-stylelint/no-invalid-sky-custom-properties': true,
    'skyux-stylelint/no-ng-deep': true,
    'skyux-stylelint/no-sky-selectors': true,
    'skyux-stylelint/no-static-color-values': true,
  },
};
```
