# `skyux-eslint-template/no-deprecated-classnames`

Prevents usage of deprecated CSS classnames in HTML templates.

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
    "skyux-eslint-template/no-deprecated-classnames": ["error"]
  }
}
```

#### ❌ Invalid Code

```html
<div class="sky-margin-inline-compact"></div>
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
