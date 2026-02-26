# skyux-eslint-template/prefer-input-box

Require native form control elements to be placed inside a `<sky-input-box>` component.

Native form control elements (`<input>`, `<select>`, `<textarea>`) in SKY UX templates should be wrapped in a `<sky-input-box>` component to ensure consistent styling, accessibility (labels, error messages, ARIA attributes), and UX patterns. See the [SKY UX input box documentation](https://developer.blackbaud.com/skyux/components/input-box) for more details.

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

This rule applies to the following native form control elements:

- `<input>`
- `<select>`
- `<textarea>`

### Exempt Input Types

The following `<input>` types are exempt because they are not text or selection controls:

- `hidden`
- `button`
- `submit`
- `reset`
- `image`
- `checkbox`
- `radio`

### Recognized Wrapper Components

The rule is satisfied when the element is inside any of these components:

- `<sky-input-box>`
- `<sky-datepicker>`
- `<sky-lookup>`
- `<sky-autocomplete>`
- `<sky-country-field>`
- `<sky-phone-field>`
- `<sky-colorpicker>`
- `<sky-timepicker>`

SKY UX wrapper components place their internal inputs inside `<sky-input-box>` themselves, so their children are not flagged.

<br>

#### ❌ Invalid Code

```html
<!-- Bare input with no wrapper -->
<input />
~~~~~~~~~

<!-- Explicit non-exempt type with no wrapper -->
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

<!-- Inside a SKY UX wrapper component -->
<sky-datepicker>
  <input />
</sky-datepicker>

<!-- Exempt input types do not require a wrapper -->
<input type="hidden" />
<input type="checkbox" />
<input type="radio" />
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
