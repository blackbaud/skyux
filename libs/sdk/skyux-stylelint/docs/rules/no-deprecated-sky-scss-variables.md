# skyux-stylelint/no-deprecated-sky-scss-variables

Prevents usage of deprecated or private `$sky-*` SCSS variables.

- Type: problem
- Fixable: yes, but not for every occurrence — see
  [Occurrences that are reported but not auto-fixed](#occurrences-that-are-reported-but-not-auto-fixed)
  below.

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-deprecated-sky-scss-variables': true,
  },
};
```

## ❌ Failing Examples

### Deprecated SCSS variable with a replacement

```scss
a {
  margin-top: $sky-margin-stacked-compact;
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### Private or unknown `$sky-` SCSS variable

```scss
a {
  margin: $sky-internal-variable;
          ~~~~~~~~~~~~~~~~~~~~~~
}
```

## ✅ Passing Examples

### CSS custom property (preferred)

```scss
a {
  margin-top: var(--sky-theme-space-stacked-xs);
}
```

### Non-sky SCSS variable

```scss
$my-spacing: 16px;

a {
  margin-top: $my-spacing;
}
```

## Occurrences that are reported but not auto-fixed

A `$sky-*` variable is always reported when it's deprecated, private, or
obsolete, but the `--fix` output only rewrites it to
`var(--sky-theme-*)` when doing so is safe. The following cases are reported
but left unfixed, and must be corrected manually:

- **No direct replacement.** Some deprecated variables have no equivalent CSS
  custom property.
- **Private or obsolete variables.** There's no way to know the intended
  replacement.
- **Used as an argument to a color function**, e.g. `rgba()`, `hsl()`,
  `color.adjust()`, or a color-channel getter like `red()`. These functions
  require a compile-time Sass color; substituting a CSS custom property
  produces syntactically valid SCSS that fails to compile (or compiles to
  invalid CSS):

  ```scss
  a {
    background: rgba($sky-deprecated-var, 0.25);
                      ~~~~~~~~~~~~~~~~~~~
  }
  ```
