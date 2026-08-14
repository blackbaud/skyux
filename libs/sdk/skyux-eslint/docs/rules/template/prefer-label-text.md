# skyux-eslint-template/prefer-label-text

Ensures form components set the `labelText` (or `headingText`) attribute, which automatically activates key usability and accessibility features, including proper ARIA labeling and label-to-control association without requiring manual `id` or `aria-*` attribute management.

Setting `labelText` (or `headingText`) on a component is the preferred, modern approach to labeling SKY UX form components. It replaces older patterns that placed a dedicated label child element (e.g. `<sky-checkbox-label>`, `<sky-input-box><label>`) inside the component.

- Type: problem
- 🔧 Supports autofix (`--fix`)

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Affected Components

### `<sky-checkbox>`

Replaces the deprecated `<sky-checkbox-label>` child element. Setting `labelText` enables:

- **Inline help** — The `helpPopoverContent` and `helpKey` inputs only activate when `labelText` is also set.
- **Hint text** — The `hintText` input provides persistent inline guidance below the checkbox.
- **Automatic error messages** — Built-in validation error messages include the `labelText` value to provide meaningful context to users.

### `<sky-input-box>`

Replaces the `<label>` child element pattern. Setting `labelText` enables:

- **Automatic label association** — The label is automatically linked to the component's internal input element. No `skyId` directive, `[for]` binding, or manual `id` management is required.
- **Inline help** — The `helpPopoverContent` and `helpKey` inputs only activate when `labelText` is also set.
- **Hint text** — The `hintText` input provides persistent inline guidance below the input.
- **Character count** — The `characterLimit` input places a character count indicator on the input.
- **Automatic error messages** — Built-in validation error messages include the `labelText` value to provide meaningful context to users.

When autofixing, the rule also removes the `sky-form-control` CSS class from child `<input>`, `<select>`, and `<textarea>` elements, since that class is no longer needed when `labelText` is used.

### `<sky-radio>`

Replaces the deprecated `<sky-radio-label>` child element. Setting `labelText` enables:

- **Inline help** — The `helpPopoverContent` and `helpKey` inputs only activate when `labelText` is also set.
- **Hint text** — The `hintText` input provides persistent inline guidance below the radio button.

### `<sky-toggle-switch>`

Replaces the deprecated `<sky-toggle-switch-label>` child element. Setting `labelText` enables:

- **Inline help** — The `helpPopoverContent` and `helpKey` inputs only activate when `labelText` is also set.

<br>

## Usage Examples

### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/prefer-label-text": ["error"]
  }
}
```

<br>

### ❌ Invalid Code

```html
<sky-checkbox>
~~~~~~~~~~~~~~
  <sky-checkbox-label>
  ~~~~~~~~~~~~~~~~~~~~
    {{ 'first_name' | skyAppResources }}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  </sky-checkbox-label>
  ~~~~~~~~~~~~~~~~~~~~~
</sky-checkbox>
~~~~~~~~~~~~~~~

<sky-input-box>
~~~~~~~~~~~~~~~
  <label>First name</label>
  ~~~~~~~~~~~~~~~~~~~~~~~~~
  <input class="sky-form-control" type="text" />
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
</sky-input-box>
~~~~~~~~~~~~~~~~
```

<br>

### ✅ Valid Code

```html
<sky-checkbox [labelText]="'first_name' | skyAppResources" />

<sky-input-box labelText="First name">
  <input type="text" />
</sky-input-box>
```
