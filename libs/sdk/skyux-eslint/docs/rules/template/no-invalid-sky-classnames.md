# `skyux-eslint-template/no-invalid-sky-classnames`

Prevents usage of invalid or private `sky-*` CSS class names in Angular HTML templates.

- Type: problem
- Fixable: yes (deprecated classes with replacements are auto-fixed)

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/no-invalid-sky-classnames": ["error"]
  }
}
```

<br>

### ❌ Invalid Code

```html
<!-- Deprecated class with a replacement -->
<div class="sky-margin-stacked-xs"></div>
            ~~~~~~~~~~~~~~~~~~~~~

<!-- Unknown sky-theme- class -->
<div class="sky-theme-does-not-exist"></div>
            ~~~~~~~~~~~~~~~~~~~~~~~~

<!-- Private or internal sky- class -->
<div class="sky-internal-widget"></div>
            ~~~~~~~~~~~~~~~~~~~~
```

### ✅ Valid Code

```html
<!-- Whitelisted utility classes -->
<div class="sky-btn sky-btn-primary"></div>

<!-- Valid sky-theme- class -->
<div class="sky-theme-margin-bottom-xs"></div>

<!-- Non-sky classes are ignored -->
<div class="my-custom-class"></div>
```
