# skyux-eslint-template/prefer-disabled-attr

Prefer the `disabled` attribute over `.sky-btn-disabled` class for elements that support the disabled attribute.

This rule encourages using the semantic HTML `disabled` attribute instead of the visual `.sky-btn-disabled` class on form elements and buttons. The `disabled` attribute provides proper accessibility semantics, keyboard navigation behavior, and screen reader support that the CSS class alone cannot provide.

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
    "skyux-eslint-template/prefer-disabled-attr": ["error"]
  }
}
```

<br>

## Affected Elements

This rule applies to the following HTML elements that support the `disabled` attribute:

- `<button>`
- `<input>`
- `<optgroup>`
- `<option>`
- `<select>`
- `<textarea>`

<br>

#### ❌ Invalid Code

```html
<!-- Static class attribute -->
<button class="sky-btn-disabled">Submit</button>
        ~~~~~~~~~~~~~~~~~~~~~~~~

<!-- Class binding -->
<button [class.sky-btn-disabled]="isDisabled">Submit</button>
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<!-- Complex class bindings -->
<input [class]="'sky-btn-disabled other-class'" />
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<select [ngClass]="{'sky-btn-disabled': isDisabled}">
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  <option>Option 1</option>
</select>
```

<br>

#### ✅ Valid Code

```html
<!-- Use the disabled attribute instead -->
<button [disabled]="isDisabled">Submit</button>

<input [disabled]="condition" />

<select [attr.disabled]="isDisabled ? '' : null">
  <option>Option 1</option>
</select>

<textarea disabled></textarea>

<!-- sky-btn-disabled class is allowed on non-form elements -->
<div class="sky-btn-disabled">Visual styling only</div>
<span [class.sky-btn-disabled]="condition">Status indicator</span>
```

<br>

## Why This Rule Exists

### Accessibility Benefits

The `disabled` attribute provides semantic meaning that assistive technologies can understand:

- Screen readers announce disabled elements appropriately
- Keyboard navigation skips disabled elements automatically
- Form validation excludes disabled elements

### Semantic HTML

Using the `disabled` attribute follows HTML standards and best practices:

- Browsers handle disabled state consistently
- Form submission automatically excludes disabled elements
- Native keyboard and mouse interactions are handled correctly

### Consistency

This rule promotes consistent patterns across the SKY UX codebase by preferring semantic HTML attributes over CSS-only solutions.
