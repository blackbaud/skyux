# skyux-eslint-template/prefer-label-text

Ensures form components set the `labelText` (or `headingText`) attribute, which automatically activates key usability and accessibility features.

- Type: problem
- 🔧 Supports autofix (`--fix`)

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

#### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/prefer-label-text": ["error"]
  }
}
```

<br>

#### ❌ Invalid Code

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
```

<br>

#### ✅ Valid Code

```html
<sky-checkbox [labelText]="'first_name' | skyAppResources" />
```
