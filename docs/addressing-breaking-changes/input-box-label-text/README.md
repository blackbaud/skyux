# Migrating from Input Box "Hard Mode"

## Overview

The `skyux-eslint-template/prefer-label-text` rule now applies to **all** `<sky-input-box>` components, including those that previously used "hard mode" (manual ID management with the `skyId` directive).

Previously, the rule would skip validation if it detected the `skyId` directive on a child input element, allowing developers to continue using the deprecated `<label>` element pattern. This exemption has been removed to ensure all input boxes benefit from the accessibility and usability features provided by the `labelText` input property.

## What Changed

**Before:** The linting rule allowed this pattern without errors when `skyId` was present:

```html
<sky-input-box>
  <label [for]="myInput.id">My label</label>
  <input #myInput="skyId" skyId class="sky-form-control" type="text" />
</sky-input-box>
```

**After:** The linting rule now reports an error and suggests using `labelText` instead:

```html
<sky-input-box labelText="My label">
  <input type="text" />
</sky-input-box>
```

## Why This Matters

Using the `labelText` input property provides several benefits:

- **Automatic accessibility**: Proper label-input association without manual ID management
- **Responsive design**: Labels automatically adapt to mobile/desktop layouts
- **Consistent styling**: Labels follow SKY UX design patterns
- **Reduced complexity**: No need to manage unique IDs or template references
- **Better maintenance**: Less code and fewer potential bugs

## Migration Steps

### Step 1: Enable Auto-Fix

The linting rule includes an auto-fix capability. Run ESLint with the `--fix` flag:

```bash
npx eslint --fix
```

This will automatically:

- Move the label text to the `labelText` input property
- Remove the `<label>` element
- Remove the `sky-form-control` CSS class from the input element
- Preserve the input element (but you can now safely remove `skyId`)

### Step 2: Remove `skyId` Directive (Optional but Recommended)

After auto-fix, your code will look like this:

```html
<sky-input-box labelText="My label">
  <input #myInput="skyId" skyId type="text" />
</sky-input-box>
```

Since `labelText` handles ID management automatically, you can remove the `skyId` directive and template reference:

```html
<sky-input-box labelText="My label">
  <input type="text" />
</sky-input-box>
```

**Note:** Only remove `skyId` if it's not being used elsewhere in your component template or code.

### Step 3: Update Form Control References (If Applicable)

If your component code references the input element using the template reference variable (e.g., `@ViewChild('myInput')`), you'll need to update those references:

**Before:**

```typescript
@ViewChild('myInput', { read: ElementRef })
public myInput: ElementRef<HTMLInputElement> | undefined;
```

**After:**

```typescript
@ViewChild('input', { read: ElementRef })
public myInput: ElementRef<HTMLInputElement> | undefined;
```

Or use a more specific selector:

```html
<sky-input-box labelText="My label">
  <input #myInputRef type="text" />
</sky-input-box>
```

```typescript
@ViewChild('myInputRef', { read: ElementRef })
public myInput: ElementRef<HTMLInputElement> | undefined;
```

## Edge Cases

### Complex Label Content

If your label contains complex content (child elements, Angular control flow syntax, or double quotes), the auto-fix will **not** be applied. You'll see a linting error but will need to migrate manually:

**Example with child elements (no auto-fix):**

```html
<!-- Not auto-fixable -->
<sky-input-box>
  <label [for]="myInput.id"> <strong>Important:</strong> First name </label>
  <input #myInput="skyId" skyId type="text" />
</sky-input-box>
```

**Solution:** Simplify the label or use heading elements separately:

```html
<div>
  <strong>Important:</strong>
  <sky-input-box labelText="First name">
    <input type="text" />
  </sky-input-box>
</div>
```

### Internationalization (i18n)

If you're using resource strings, the auto-fix handles them correctly:

**Before:**

```html
<sky-input-box>
  <label>{{ 'first_name' | skyAppResources }}</label>
  <input type="text" />
</sky-input-box>
```

**After (auto-fixed):**

```html
<sky-input-box labelText="{{ 'first_name' | skyAppResources }}">
  <input type="text" />
</sky-input-box>
```

Or use property binding:

```html
<sky-input-box [labelText]="'first_name' | skyAppResources">
  <input type="text" />
</sky-input-box>
```

## Additional Resources

- [SKY UX Input Box Documentation](https://developer.blackbaud.com/skyux/components/input-box)
- [`skyId` Directive Documentation](https://developer.blackbaud.com/skyux/components/id)
- [ESLint Rule: `prefer-label-text`](../../libs/sdk/skyux-eslint/docs/rules/template/prefer-label-text.md)

## Need Help?

If you encounter issues during migration or have questions, please reach out to the SKY UX team or file an issue in the [SKY UX GitHub repository](https://github.com/blackbaud/skyux/issues).
