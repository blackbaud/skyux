# skyux-stylelint/no-sky-theme-imports

Disallows direct imports from `@skyux/theme/scss/*` paths except for `@skyux/theme/scss/responsive`.

The SCSS variables and mixins in `@skyux/theme/scss/*` files are internal implementation details and are not part of the public API. Direct imports from these paths can lead to API instability, breaking changes, and inconsistent theming. Use the documented CSS custom properties (e.g., `var(--sky-color-text-default)`) instead.

Only `@skyux/theme/scss/responsive` (with or without the `.scss` extension) is permitted for direct import because it contains approved mixins for responsive design.

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-sky-theme-imports': true,
  },
};
```

## ❌ Failing Examples

### Importing internal SCSS files

```scss
@import '@skyux/theme/scss/mixins.scss';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

```scss
@import '@skyux/theme/scss/variables.scss';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

```scss
@use '@skyux/theme/scss/_compat/_mixins.scss';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

```scss
@forward '@skyux/theme/scss/themes/modern/_compat/_variables.scss';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

## ✅ Passing Examples

### Importing the approved responsive module

```scss
@import '@skyux/theme/scss/responsive.scss';
@import '@skyux/theme/scss/responsive';
@use '@skyux/theme/scss/responsive';
@forward '@skyux/theme/scss/responsive';
```

### Importing from other packages

```scss
@import '@angular/material/theming';
```

### Importing the main theme entry point

```scss
@import '@skyux/theme';
```
