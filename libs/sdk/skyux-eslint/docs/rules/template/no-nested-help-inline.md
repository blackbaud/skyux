# `skyux-eslint-template/no-nested-help-inline`

Prevents nesting `sky-help-inline` within `sky-alert`, `sky-label`, and `sky-token` components. Place the help inline component after the wrapping component instead.

- Type: problem
- 🔧 Supports autofix (`--fix`)
- 💡 Provides suggestions

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/no-nested-help-inline": ["error"]
  }
}
```

### ❌ Invalid Code

```html
<sky-label>
  Foo
  <sky-help-inline helpKey="foo" />
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
</sky-label>
```

```html
<sky-alert alertType="info">
  Foo
  <sky-help-inline helpKey="foo" />
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
</sky-alert>
```

### ✅ Valid Code

```html
<sky-label>Foo</sky-label>
<sky-help-inline helpKey="foo" />
```

```html
<sky-status-indicator descriptionType="none">
  Foo
  <sky-help-inline class="sky-control-help" helpKey="foo" />
</sky-status-indicator>
```

<br>

## Autofix and Suggestions

The rule moves the `sky-help-inline` element after the outermost wrapping component.

- `sky-label`, and `sky-alert` without a `closeable` input or with `[closeable]="false"`, are fixed automatically with `--fix`.
- `sky-token` and closeable `sky-alert` components only offer a suggestion, because the moved help button stays visible after the wrapping component is dismissed. Review each suggestion before applying it. A static `closeable` attribute counts as closeable, since it binds a string that is truthy unless empty.
- The rule neither fixes nor suggests when the wrapping component or the `sky-help-inline` element has a structural directive, or when a control flow block sits between them, because moving the element would drop or break that condition.
