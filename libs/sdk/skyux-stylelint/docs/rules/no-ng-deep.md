# skyux-stylelint/no-ng-deep

Disallow the usage of `::ng-deep` in CSS selectors. According to [Angular's official documentation](https://angular.dev/guide/components/styling#ng-deep), the Angular team strongly discourages new use of `::ng-deep` as it breaks component encapsulation and exists only for backwards compatibility.

## Why this rule exists

The `::ng-deep` pseudo-element was introduced as a shadow-piercing combinator to allow styles to penetrate component boundaries in Angular's emulated view encapsulation. However, it has several significant drawbacks:

1. **Breaks component encapsulation**: Defeats the purpose of scoped component styles
2. **Creates global styles**: Styles leak out and can affect other components unintentionally
3. **Difficult to maintain**: Makes it hard to understand which styles apply where
4. **Deprecated by Angular team**: Strongly discouraged and may be removed in future versions

## Better alternatives

Instead of using `::ng-deep`, consider these approaches:

- **Use `:host` selectors** for styling the component's host element
- **Use `:host-context()`** for conditional styling based on ancestor classes
- **Use component communication** (inputs, outputs, services) to coordinate styling
- **Use global styles** in `styles.css` for truly global styles
- **Use CSS custom properties (variables)** to pass styling data down to child components

## Usage

### stylelint.config.mjs

```js
export default {
  plugins: ['skyux-stylelint'],
  rules: {
    'skyux-stylelint/no-ng-deep': true,
  },
};
```

## ❌ Failing Examples

### Basic `::ng-deep` usage

```css
::ng-deep .global-style {
~~~~~~~~
  color: red;
}
```

### `::ng-deep` with `:host`

```css
:host ::ng-deep .child-component {
      ~~~~~~~~
  background: blue;
}
```

### `::ng-deep` in complex selectors

```css
.parent ::ng-deep .child .nested {
       ~~~~~~~~
  margin: 10px;
}
```

### `::ng-deep` in media queries

```css
@media (min-width: 768px) {
  ::ng-deep .responsive {
  ~~~~~~~~
    font-size: 18px;
  }
}
```

## ✅ Passing Examples

### Using `:host` selectors

```css
:host {
  display: block;
  background: white;
}

:host(.theme-dark) {
  background: black;
}
```

### Using `:host-context()`

```css
:host-context(.mobile) {
  font-size: 14px;
}

:host-context(.desktop) {
  font-size: 16px;
}
```

### Regular component styles

```css
.my-component {
  color: blue;
}

.my-component .nested-element {
  margin: 10px;
}
```

### Global styles (in global stylesheet)

```css
/* In styles.css or global stylesheet */
.global-utility-class {
  text-align: center;
}
```

### Using CSS custom properties

```css
/* Parent component */
:host {
  --child-background: #f0f0f0;
  --child-text-color: #333;
}

/* Child component can use these variables */
.child-content {
  background: var(--child-background, white);
  color: var(--child-text-color, black);
}
```

## Configuration

This rule accepts a boolean value:

- `true` (default): Disallows all usage of `::ng-deep`
- `null`: Disables the rule

## Related Links

- [Angular Documentation - Style Scoping](https://angular.dev/guide/components/styling#style-scoping)
- [Angular Documentation - ::ng-deep](https://angular.dev/guide/components/styling#ng-deep)
- [Angular Style Guide - Component Styles](https://angular.dev/style-guide#component-styles)
