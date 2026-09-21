# `skyux-eslint-template/no-native-click`

Disallow binding a component's native `click` event; use its dedicated output instead.

Some SKY UX components wrap an internal `<button>` or `<a>` and re-emit its
native click as a dedicated output (for example, `sky-button`'s
`buttonClick`). Binding `(click)` directly on the component instead relies
on the native event bubbling up from that internal element, which is
unreliable for assistive technology.

- Type: problem
- 🔧 Supports autofix (`--fix`) when the handler does not reference `$event`

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/no-native-click": ["error"]
  }
}
```

### ❌ Invalid Code

```html
<sky-button (click)="save()">Save</sky-button>
            ~~~~~~~~~~~~~~~~
```

```html
<sky-action-button (click)="delete()">
                    ~~~~~~~~~~~~~~~~~
  <sky-action-button-header>Delete</sky-action-button-header>
</sky-action-button>
```

### ✅ Valid Code

```html
<sky-button (buttonClick)="save()">Save</sky-button>

<sky-action-button (actionClick)="delete()">
  <sky-action-button-header>Delete</sky-action-button-header>
</sky-action-button>
```

<br>

## Auto-Fix Support

`<sky-button (click)="save()">` autofixes to
`<sky-button (buttonClick)="save()">`. A handler that references `$event`
(for example, `(click)="save($event)"`) is reported without a fix, since the
alternative output does not always emit the same event shape as the native
`click`.
