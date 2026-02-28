# skyux-eslint-template/prefer-input-box

Require text-like form control elements to be placed inside a `<sky-input-box>` component.

Text-like form control elements (`<input>` with types like `text`, `email`, `number`, etc.), `<select>`, and `<textarea>` in SKY UX templates should be wrapped in a `<sky-input-box>` component to ensure consistent styling, accessibility (labels, error messages, ARIA attributes), and UX patterns. See the [SKY UX input box documentation](https://developer.blackbaud.com/skyux/components/input-box) for more details.

> **Note:** Input types that have dedicated SKY UX component equivalents (e.g., `checkbox`, `radio`, `date`) are handled by the [`prefer-form-control-component`](./prefer-form-control-component.md) rule instead.

- Type: problem

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

#### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/prefer-input-box": ["error"]
  }
}
```

<br>

## Affected Elements

This rule applies to the following elements:

- `<select>`
- `<textarea>`
- `<input>` with the following types (or no `type` attribute, which defaults to `text`):
  - `email`
  - `month`
  - `number`
  - `password`
  - `range`
  - `text`
  - `url`
  - `week`

<br>

#### ❌ Invalid Code

```html
<!-- Bare input with no wrapper -->
<input />
~~~~~~~~~

<!-- Explicit text type with no wrapper -->
<input type="text" />
~~~~~~~~~~~~~~~~~~~~~

<!-- Non-wrapper ancestor does not satisfy the rule -->
<div><input /></div>
     ~~~~~~~~~
```

<br>

#### ✅ Valid Code

```html
<!-- Inside sky-input-box -->
<sky-input-box>
  <input />
</sky-input-box>

<!-- Nested deeper inside sky-input-box -->
<sky-input-box>
  <div>
    <select>
      <option>Option 1</option>
    </select>
  </div>
</sky-input-box>

<!-- Inside sky-colorpicker (wraps its own input) -->
<sky-colorpicker>
  <input type="text" />
</sky-colorpicker>

<!-- Input types handled by prefer-form-control-component are not flagged -->
<input type="checkbox" />
<input type="radio" />
<input type="date" />

<!-- Non-form-control input types are not flagged -->
<input type="hidden" />
<input type="button" />
```

<br>

## Why This Rule Exists

### Consistent Styling

The `<sky-input-box>` component provides uniform visual treatment for form controls, including focus states, error indicators, and spacing.

### Accessibility

Wrapping controls in `<sky-input-box>` ensures that labels, help text, and error messages are properly associated with the control through ARIA attributes, improving the experience for assistive technology users.

### UX Patterns

SKY UX input boxes handle consistent interaction patterns such as character counts, hint text, and inline validation messaging that would otherwise need to be implemented manually.
