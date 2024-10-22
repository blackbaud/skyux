# `skyux-eslint-template/no-deprecated-directives`

Prevents usage of deprecated directives and components in HTML templates.

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
    "skyux-eslint-template/no-deprecated-directives": ["error"]
  }
}
```

#### ❌ Invalid Code

```html
<sky-card></sky-card>
~~~~~~~~~~~~~~~~~~~~~
```

```html
<sky-file-attachment (fileChange)="onFileChange()" />
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
