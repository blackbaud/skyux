# `skyux-eslint-template/no-legacy-icons`

Prevents usage of legacy icons in HTML templates.

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
    "skyux-eslint-template/no-legacy-icons": ["error"]
  }
}
```

#### ❌ Invalid Code

```html
<sky-icon icon="plus-circle"></sky-icon>
          ~~~~~~~~~~~~~~~~~~
```
```html
<sky-action-button-container>
  <sky-action-button (actionClick)="filterActionClick()">
    <sky-action-button-icon iconType="trash" />
                            ~~~~~~~~~~~~~~~~
    <sky-action-button-header> Delete a list </sky-action-button-header>
    <sky-action-button-details>
      Delete an existing list.
    </sky-action-button-details>
  </sky-action-button>
</sky-action-button-container>
```
