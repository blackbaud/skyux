# `skyux-eslint-template/no-nested-help-inline`

Prevents nesting `sky-help-inline` within `sky-alert`, `sky-label`, and `sky-token` components, which do not support it.

- Type: problem

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

The rule does not provide an autofix or suggestions. Resolving a violation can require rethinking how help is provided for the content, which may call for larger changes than relocating the `sky-help-inline` element.
