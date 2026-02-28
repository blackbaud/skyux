# skyux-eslint-template/no-invalid-input-box-children

Disallow invalid form control elements inside `<sky-input-box>`.

This rule validates that `<sky-input-box>` only wraps form control elements that are appropriate for the input box component. It also flags cases where multiple form controls are placed inside a single `<sky-input-box>`.

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
    "skyux-eslint-template/no-invalid-input-box-children": ["error"]
  }
}
```

<br>

## Valid Children

The following elements are valid inside `<sky-input-box>`:

### Native Form Controls

- `<select>`
- `<textarea>`
- `<input>` with types: `email`, `month`, `number`, `password`, `range`, `text`, `url`, `week` (or no `type` attribute)

### SKY UX Form Control Components

- `<sky-autocomplete>`
- `<sky-country-field>`
- `<sky-datepicker>`
- `<sky-lookup>`
- `<sky-phone-field>`
- `<sky-timepicker>`

### SKY UX Non-Control Components

The following SKY UX components are allowed inside `<sky-input-box>` alongside a form control (they are not counted as form controls):

- `<sky-character-counter-indicator>`
- `<sky-form-error>`
- `<sky-status-indicator>`

### Multiple Controls

Each `<sky-input-box>` should contain exactly one form control. Having multiple controls inside a single input box results in incorrect styling and accessibility.

<br>

#### ❌ Invalid Code

```html
<!-- Invalid input type inside sky-input-box -->
<sky-input-box>
  <input type="checkbox" />
  ~~~~~~~~~~~~~~~~~~~~~~~~
</sky-input-box>

<!-- Invalid sky component inside sky-input-box -->
<sky-input-box>
  <sky-checkbox></sky-checkbox>
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
</sky-input-box>

<!-- Multiple form controls inside sky-input-box -->
<sky-input-box>
~~~~~~~~~~~~~~~~
  <input />
  <input />
</sky-input-box>
~~~~~~~~~~~~~~~~
```

<br>

#### ✅ Valid Code

```html
<!-- Valid input types -->
<sky-input-box>
  <input type="text" />
</sky-input-box>

<!-- Valid native form controls -->
<sky-input-box>
  <select>
    <option>Option 1</option>
  </select>
</sky-input-box>

<!-- Valid sky components -->
<sky-input-box>
  <sky-datepicker>
    <input skyDatepickerInput />
  </sky-datepicker>
</sky-input-box>

<!-- Structural HTML elements are fine alongside the form control -->
<sky-input-box>
  <div>
    <input />
  </div>
</sky-input-box>
```

<br>

## Why This Rule Exists

### Correct Styling

The `<sky-input-box>` component is designed to style a single text-like form control. Placing unsupported controls inside it (such as checkboxes, radio buttons, or file inputs) results in incorrect visual treatment.

### Accessibility

Each `<sky-input-box>` associates its label, help text, and error messages with a single form control through ARIA attributes. Multiple controls inside one input box breaks this association.

### Component Selection

Input types with dedicated SKY UX components (such as `<sky-checkbox>` for checkboxes or `<sky-datepicker>` for dates) should use those components directly instead of being wrapped in `<sky-input-box>`. See the [`prefer-form-control-component`](./prefer-form-control-component.md) rule for guidance.
