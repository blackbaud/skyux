# skyux-eslint-template/no-invalid-input-types

Disallow invalid `type` attribute values on `<input>` elements.

This rule checks that the `type` attribute on `<input>` elements uses a valid HTML input type value. Invalid types cause the browser to fall back to `type="text"`, which can lead to unexpected behavior.

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
    "skyux-eslint-template/no-invalid-input-types": ["error"]
  }
}
```

<br>

## Valid Input Types

The following are the valid HTML input type values:

`button`, `checkbox`, `color`, `date`, `datetime-local`, `email`, `file`, `hidden`, `image`, `month`, `number`, `password`, `radio`, `range`, `reset`, `search`, `submit`, `tel`, `text`, `time`, `url`, `week`

An `<input>` element with no `type` attribute is valid (it defaults to `text`).

<br>

#### ❌ Invalid Code

```html
<!-- Unknown type -->
<input type="foobar" />
       ~~~~~~~~~~~~~~

<!-- Common mistake -->
<input type="datepicker" />
       ~~~~~~~~~~~~~~~~~~
```

<br>

#### ✅ Valid Code

```html
<!-- Valid types -->
<input type="text" />
<input type="email" />
<input type="number" />
<input type="checkbox" />

<!-- No type attribute (defaults to "text") -->
<input />
```

<br>

## Why This Rule Exists

When an `<input>` element has an invalid `type` attribute, browsers silently fall back to `type="text"`. This can mask developer intent and cause unexpected form behavior. Catching invalid types at lint time prevents these silent failures.
