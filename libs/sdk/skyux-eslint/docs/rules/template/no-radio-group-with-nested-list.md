# `skyux-eslint-template/no-radio-group-with-nested-list`

Prevents nesting of ordered and unordered lists within `sky-radio-group` components, for accessibility reasons.

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
    "skyux-eslint-template/no-radio-group-with-nested-list": ["error"]
  }
}
```

#### ❌ Invalid Code

```html
<sky-radio-group>
  <ul>
  ~~~~
    <li>
    ~~~~
      <sky-radio labelText="Foo" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    </li>
    ~~~~~
    <li>
    ~~~~
      <sky-radio>
      ~~~~~~~~~~~
        <sky-radio-label>Foo</sky-radio-label>
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      </sky-radio>
      ~~~~~~~~~~~~
    </li>
    ~~~~~
  </ul>
  ~~~~~
</sky-radio-group>
```

```html
<sky-radio-group>
  <ol>
  ~~~~
    <li *ngFor="let item of items">
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      <sky-radio labelText="Foo" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    </li>
    ~~~~~
  </ol>
  ~~~~~
</sky-radio-group>
```
