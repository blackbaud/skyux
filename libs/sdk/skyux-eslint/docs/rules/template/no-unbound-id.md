# skyux-eslint-template/no-unbound-id

Prevents usage of static IDs on HTML elements. For accessibility reasons, all IDs on the page must be unique. Most elements do not need an ID to be specified. For elements that must have an ID assigned, we recommend using the [`skyId`](https://developer.blackbaud.com/skyux/components/id) directive. For form elements inside of a [SKY UX input box](https://developer.blackbaud.com/skyux/components/input-box), use the input box's `labelText` input to specify a label, and do not assign an ID.

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

```html
<sky-input-box labelText="Foo">
  <input id="my-foo" type="text">
  ~~~~~~~~~~~~~~
</sky-input-box>
```

```html
<sky-input-box labelText="Foo">
  <input id="my-foo" skyId>
  ~~~~~~~~~~~~~~
</sky-input-box>
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

```html
<sky-input-box labelText="Foo">
  <input id="my-foo">
</sky-input-box>
```
