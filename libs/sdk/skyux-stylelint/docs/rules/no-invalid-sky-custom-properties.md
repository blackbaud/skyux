# skyux-stylelint/no-invalid-sky-custom-properties

Prevents usage of invalid or private `--sky-*` CSS custom properties.

- Type: problem
- Fixable: yes (deprecated properties with replacements are auto-fixed)

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-invalid-sky-custom-properties': true,
  },
};
```

## ❌ Failing Examples

### Deprecated custom property with a replacement

```css
a {
  color: var(--sky-text-color-default);
             ~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### Unknown `--sky-theme-` custom property

```css
a {
  margin-top: var(--sky-theme-unknown-token);
                  ~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### Private `--sky-` custom property

```css
a {
  color: var(--sky-internal-color);
             ~~~~~~~~~~~~~~~~~~~~
}
```

## ✅ Passing Examples

### Valid `--sky-theme-` custom property

```css
a {
  color: var(--sky-theme-color-text-default);
}
```

### Non-sky custom property

```css
a {
  color: var(--my-custom-color);
}
```
