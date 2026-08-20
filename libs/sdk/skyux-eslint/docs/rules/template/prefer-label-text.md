# skyux-eslint-template/prefer-label-text

Ensures form components set the `labelText` (or `headingText`) attribute, which automatically activates key usability and accessibility features, including proper ARIA labeling and label-to-control association without requiring manual `id` or `aria-*` attribute management.

Setting `labelText` (or `headingText`) on a component is the preferred, modern approach to labeling SKY UX form components. It replaces older patterns that placed a dedicated label child element (e.g. `<sky-checkbox-label>`, `<sky-input-box><label>`) inside the component.

The rule reports three problems:

1. **A label child element is used.** Set `labelText` instead. This is autofixable.
2. **The component has no label at all.** Without a label, the form control has no accessible name, so screen reader users have no way to know what the control is for, and built-in validation error messages have no text to reference. The deprecated `label` and `labelledBy` inputs on `<sky-checkbox>` and `<sky-radio>` do **not** satisfy the rule — to give a control an accessible name without a visible label, set `labelText` along with `labelHidden`.
3. **`labelText` is set but empty.** An empty or whitespace-only value renders no label, so it is equivalent to having none. A bound `labelText` is not evaluated, so an expression that resolves to an empty string at runtime cannot be reported. Only property and two-way bindings set the input, so an `[attr.labelText]`, `[class.labelText]`, or `[style.labelText]` binding does not count as a label.

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

No label at all:

```html
<sky-checkbox />
~~~~~~~~~~~~~~~~

<sky-checkbox [labelledBy]="headerId.id" />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<sky-input-box>
~~~~~~~~~~~~~~~
  <sky-lookup />
  ~~~~~~~~~~~~~~
</sky-input-box>
~~~~~~~~~~~~~~~~
```

An empty `labelText`:

```html
<sky-checkbox labelText="" />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

<br>

### ✅ Valid Code

```html
<sky-checkbox [labelText]="'first_name' | skyAppResources" />

<sky-input-box labelText="First name">
  <input type="text" />
</sky-input-box>

<!-- Use `labelHidden` when another element supplies the visible label. -->
<sky-checkbox labelHidden labelText="Notify me" />
```
