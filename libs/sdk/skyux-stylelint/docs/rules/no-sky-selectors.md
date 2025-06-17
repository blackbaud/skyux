# skyux-stylelint/no-sky-selectors

Do not reference SKY UX classes, IDs, or components when writing CSS selectors. A component's classes, IDs, and HTML are not included in the public API and are prone to change. Instead, apply a custom class or ID to the element you wish to style.

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-sky-selectors': true,
  },
};
```

## ❌ Failing Examples

### Referencing `.sky-` classes

```css
.sky-btn {}
~~~~~~~~
```

```html
<button class="sky-btn sky-btn-default" type="button">Continue</button>
```

### Referencing `#sky-` IDs

```css
#sky-foobar {}
~~~~~~~~~~~
```

```html
<div id="sky-foobar"></div>
```

### Referencing `sky-` components

```css
sky-input-box:last-child {}
~~~~~~~~~~~~~~~~~~~~~~~~
```

```html
<sky-input-box labelText="First name"></sky-input-box>
```

## ✅ Passing Examples

### Use a custom class

```css
.my-btn {
}
```

```html
<button class="sky-btn sky-btn-default my-btn" type="button">Continue</button>
```

### Apply a custom class to components

```css
.my-first-name-control:last-child {
}
```

```html
<sky-input-box
  class="my-first-name-control"
  labelText="First name"
></sky-input-box>
```
