# skyux-eslint-template/prefer-input-box-for-sky-components

Require certain SKY UX form control components to be placed inside a `<sky-input-box>` component.

SKY UX form control components that accept user input should be wrapped in `<sky-input-box>` to ensure consistent styling, accessibility, and UX patterns such as labels, help text, and validation messaging.

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
    "skyux-eslint-template/prefer-input-box-for-sky-components": ["error"]
  }
}
```

<br>

## Affected Components

This rule applies to the following SKY UX components:

- `<sky-autocomplete>`
- `<sky-country-field>`
- `<sky-datepicker>`
- `<sky-lookup>`
- `<sky-phone-field>`
- `<sky-timepicker>`

<br>

#### ❌ Invalid Code

```html
<!-- SKY UX component without sky-input-box wrapper -->
<sky-datepicker>
~~~~~~~~~~~~~~~~
  <input skyDatepickerInput />
</sky-datepicker>
~~~~~~~~~~~~~~~~~

<!-- Non-input-box wrapper does not satisfy the rule -->
<div>
  <sky-phone-field>
  ~~~~~~~~~~~~~~~~~
    <input skyPhoneFieldInput />
  </sky-phone-field>
  ~~~~~~~~~~~~~~~~~~
</div>
```

<br>

#### ✅ Valid Code

```html
<!-- Inside sky-input-box -->
<sky-input-box>
  <sky-datepicker>
    <input skyDatepickerInput />
  </sky-datepicker>
</sky-input-box>

<!-- Nested deeper inside sky-input-box -->
<sky-input-box>
  <div>
    <sky-timepicker>
      <input skyTimepickerInput />
    </sky-timepicker>
  </div>
</sky-input-box>
```

<br>

## Why This Rule Exists

### Consistent Styling

The `<sky-input-box>` component provides uniform visual treatment for form controls, including focus states, error indicators, and spacing.

### Accessibility

Wrapping SKY UX form control components in `<sky-input-box>` ensures that labels, help text, and error messages are properly associated with the control through ARIA attributes.

### UX Patterns

SKY UX input boxes handle consistent interaction patterns such as character counts, hint text, and inline validation messaging.
