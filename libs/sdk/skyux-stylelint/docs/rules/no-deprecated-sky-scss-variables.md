# skyux-stylelint/no-deprecated-sky-scss-variables

Prevents usage of deprecated or private `$sky-*` SCSS variables.

- Type: problem
- Fixable: yes (deprecated variables with replacements are auto-fixed to their CSS custom property equivalent)

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
