# skyux-eslint-template/prefer-form-control-component

Recommend SKY UX components instead of native HTML input elements for certain input types.

When a native `<input>` element's type has a dedicated SKY UX component equivalent, this rule flags the native input and recommends the appropriate SKY UX component. SKY UX components provide consistent styling, accessibility, and behavior out of the box.

- Type: suggestion

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

#### Default Config

```json
{
  "rules": {
    "skyux-eslint-template/prefer-form-control-component": ["error"]
  }
}
```

<br>

## Component Mappings

### checkbox

Use `<sky-checkbox>` instead of `<input type="checkbox">`. For groups of checkboxes, wrap them in `<sky-checkbox-group>`.

```html
<!-- Before -->
<input type="checkbox" />

<!-- After -->
<sky-checkbox />
```

### color

Use `<sky-colorpicker>` instead of `<input type="color">`.

```html
<!-- Before -->
<input type="color" />

<!-- After -->
<sky-input-box>
  <sky-colorpicker>
    <input />
  </sky-colorpicker>
</sky-input-box>
```

### date

Use `<sky-datepicker>` instead of `<input type="date">`.

```html
<!-- Before -->
<input type="date" />

<!-- After -->
<sky-input-box>
  <sky-datepicker>
    <input skyDatepickerInput />
  </sky-datepicker>
</sky-input-box>
```

### datetime-local

Use `<sky-datepicker>` and `<sky-timepicker>` as two separate fields instead of `<input type="datetime-local">`.

```html
<!-- Before -->
<input type="datetime-local" />

<!-- After -->
<sky-input-box>
  <sky-datepicker>
    <input skyDatepickerInput />
  </sky-datepicker>
</sky-input-box>
<sky-input-box>
  <sky-timepicker>
    <input skyTimepickerInput />
  </sky-timepicker>
</sky-input-box>
```

### file

Use `<sky-file-attachment>` for a single file or `<sky-file-drop>` for multiple files instead of `<input type="file">`.

```html
<!-- Before -->
<input type="file" />

<!-- After (single file) -->
<sky-file-attachment />

<!-- After (multiple files) -->
<sky-file-drop />
```

### radio

Use `<sky-radio-group>` and `<sky-radio>` instead of `<input type="radio">`.

```html
<!-- Before -->
<input type="radio" name="option" value="1" />
<input type="radio" name="option" value="2" />

<!-- After -->
<sky-radio-group>
  <sky-radio value="1" />
  <sky-radio value="2" />
</sky-radio-group>
```

### search

Use `<sky-search>` instead of `<input type="search">`.

```html
<!-- Before -->
<input type="search" />

<!-- After -->
<sky-search />
```

### tel

Use `<sky-phone-field>` instead of `<input type="tel">`.

```html
<!-- Before -->
<input type="tel" />

<!-- After -->
<sky-input-box>
  <sky-phone-field>
    <input skyPhoneFieldInput />
  </sky-phone-field>
</sky-input-box>
```

### time

Use `<sky-timepicker>` instead of `<input type="time">`.

```html
<!-- Before -->
<input type="time" />

<!-- After -->
<sky-input-box>
  <sky-timepicker>
    <input skyTimepickerInput />
  </sky-timepicker>
</sky-input-box>
```

<br>

## Why This Rule Exists

SKY UX provides dedicated components for many input types that offer advantages over native HTML inputs:

- **Consistent styling** that matches the SKY UX design system
- **Built-in accessibility** with proper ARIA attributes and keyboard navigation
- **Enhanced UX patterns** such as date pickers, color pickers, and phone field formatting
- **Validation and formatting** appropriate to each input type
