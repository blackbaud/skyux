# skyux-stylelint/no-static-color-values

Prevent consumers from assigning static color values to color-related CSS properties. Use SKY UX approved custom properties instead.

This rule prevents the use of static color values (hex, RGB, RGBA, HSL, HSLA, and named colors) on the following CSS properties:

- `color`
- `background`
- `background-color`
- `border`
- `border-color`
- `border-top-color`
- `border-right-color`
- `border-bottom-color`
- `border-left-color`

## Rationale

Static color values can create inconsistency in the user interface and make it difficult to maintain a cohesive design system. SKY UX provides approved custom properties that ensure consistency across all applications and support theming.

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-static-color-values': true,
  },
};
```

## ❌ Failing Examples

### Hex colors

```css
.my-component {
  color: #fff;
  ~~~~~~~~~~~~~~
}
```

```css
.my-component {
  background-color: #000000;
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### RGB/RGBA colors

```css
.my-component {
  color: rgb(255, 255, 255);
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

```css
.my-component {
  background-color: rgba(0, 0, 0, 0.5);
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### HSL/HSLA colors

```css
.my-component {
  border-color: hsl(0, 0%, 100%);
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### Named colors

```css
.my-component {
  color: red;
  ~~~~~~~~~~~
}
```

```css
.my-component {
  background-color: blue;
  ~~~~~~~~~~~~~~~~~~~~~~
}
```

### Shorthand properties with static colors

```css
.my-component {
  border: 1px solid red;
  ~~~~~~~~~~~~~~~~~~~~~~
}
```

```css
.my-component {
  background: #fff url(image.png) no-repeat;
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

### Specific border colors

```css
.my-component {
  border-top-color: #fff;
  ~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

```css
.my-component {
  border-right-color: green;
  ~~~~~~~~~~~~~~~~~~~~~~~~~~
}
```

## ✅ Passing Examples

### Using approved SKY UX custom properties

```css
.my-component {
  color: var(--sky-color-text-default);
}
```

```css
.my-component {
  background-color: var(--sky-background-color-page-default);
}
```

```css
.my-component {
  border-color: var(--sky-border-color-neutral-medium);
}
```

```css
.my-component {
  border: 1px solid var(--sky-border-color-neutral-medium);
}
```

### CSS keywords that are allowed

```css
.my-component {
  color: inherit;
}
```

```css
.my-component {
  background-color: transparent;
}
```

```css
.my-component {
  color: currentColor;
}
```

### Non-color properties (not affected by this rule)

```css
.my-component {
  margin: 10px;
  font-size: 16px;
  width: 100px;
}
```

## Approved SKY UX Custom Properties

Use custom properties that follow these patterns:

- `var(--sky-color-*)`
- `var(--sky-background-color-*)`
- `var(--sky-border-color-*)`
- `var(--sky-text-color-*)`
- `var(--sky-category-color-*)`
- `var(--sky-highlight-color-*)`

For a complete list of available custom properties, see the [SKY UX Color documentation](https://developer.blackbaud.com/skyux/design/styles/color).

## Configuration

This rule accepts a boolean value. When set to `true`, the rule is enabled.

```js
{
  "rules": {
    "skyux-stylelint/no-static-color-values": true
  }
}
```
