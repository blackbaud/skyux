# no-sky-theme-imports

Disallows direct imports from `@skyux/theme/scss/*` paths except for `responsive`.

## Rule details

This rule prevents imports from `@skyux/theme/scss/*` paths because the SCSS variables and mixins in these files are not considered part of the public API. The SKY UX team recommends using the documented CSS custom properties instead of importing internal SCSS files directly.

Only `@skyux/theme/scss/responsive` (with or without `.scss` extension) is permitted for direct import because it contains approved mixins that allow consumers to write responsive styles.

## Examples

### ❌ Incorrect

```scss
@import '@skyux/theme/scss/mixins.scss';
@import '@skyux/theme/scss/variables.scss';
@use '@skyux/theme/scss/_compat/_mixins.scss';
@forward '@skyux/theme/scss/themes/modern/_compat/_variables.scss';

// Without extensions
@import '@skyux/theme/scss/mixins';
@import '@skyux/theme/scss/variables';
```

### ✅ Correct

```scss
// Only responsive is allowed for direct import
@import '@skyux/theme/scss/responsive.scss';
@import '@skyux/theme/scss/responsive';
@use '@skyux/theme/scss/responsive';
@forward '@skyux/theme/scss/responsive';

// Main theme import is allowed
@import '@skyux/theme';

// Other packages are allowed
@import '@angular/material/theming';
```

## Options

This rule accepts a boolean value:

```json
{
  "rules": {
    "skyux/no-sky-theme-imports": true
  }
}
```

## Why?

The SKY UX team considers SCSS variables and mixins in `@skyux/theme/scss/*` files to be internal implementation details, not part of the public API. Direct imports from these paths can lead to:

1. **API instability**: Internal SCSS files may change between versions without notice
2. **Breaking changes**: Theme structure and variable names are subject to change
3. **Inconsistent theming**: Bypassing the documented CSS custom properties can result in inconsistent styling
4. **Maintenance burden**: Direct dependency on internal files makes upgrades more difficult

**Recommended approach**: Use the documented CSS custom properties (e.g., `var(--sky-color-text-default)`) instead of importing SCSS variables directly.

**Exception**: `@skyux/theme/scss/responsive` contains approved mixins for responsive design and is part of the public API.
