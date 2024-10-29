# skyux-eslint-template/no-unbound-id

Prevents usage of static IDs on HTML elements. For accessibility reasons, all IDs on the page must be unique; to guarantee this, we recommend using the [`skyId`](https://developer.blackbaud.com/skyux/components/id) directive.

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
    "skyux-eslint-template/no-unbound-id": ["error"]
  }
}
```

<br>

#### ❌ Invalid Code

```html
<div id="my-foo">
~~~~~~~~~~~~~~
```

<br>

#### ✅ Valid Code

```html
<div #myDiv="skyId" skyId>
```

```html
<div [attr.id]="fooId">
```

```html
<div id="{{ fooId }}">
```
