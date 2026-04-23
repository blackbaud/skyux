# `skyux-eslint/no-invalid-sky-classnames`

Prevents usage of invalid or private `sky-*` CSS class names in TypeScript string literals.

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
    "skyux-eslint/no-invalid-sky-classnames": ["error"]
  }
}
```

<br>

### ❌ Invalid Code

```ts
// Deprecated class with a replacement
element.classList.add('sky-margin-stacked-xs');
                       ~~~~~~~~~~~~~~~~~~~~

// Unknown sky-theme- class
element.className = 'sky-theme-does-not-exist';
                     ~~~~~~~~~~~~~~~~~~~~~~~~

// Private or internal sky- class
element.classList.add('sky-internal-widget');
                       ~~~~~~~~~~~~~~~~~~~~
```

### ✅ Valid Code

```ts
// Whitelisted utility classes
element.classList.add('sky-btn');
element.classList.add('sky-btn-primary');

// Valid sky-theme- class
element.className = 'sky-theme-margin-bottom-xs';

// Non-sky classes are ignored
element.className = 'my-custom-class';
```
