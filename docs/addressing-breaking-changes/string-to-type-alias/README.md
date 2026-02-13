# SKY UX String-to-Type-Alias Migration Prompt

## Context

SKY UX has converted many component properties that previously accepted generic `string` types to use specific type aliases (string union types). This change improves type safety, enables better IntelliSense autocomplete, and makes the valid values explicit in the TypeScript type system.

## What Changed

Previously, certain properties were typed as `string` or `string | undefined`, but they only accepted specific string values. These properties have now been changed to use type aliases that explicitly define the valid values.

### Example

**Before:**

```typescript
export interface MyComponentOptions {
  timeFormat?: string;  // Could be any string, but only 'hh' or 'HH' were valid
}

// Component usage
public config: MyComponentOptions = {
  timeFormat: 'hh'  // TypeScript allowed any string here
};
```

**After:**

```typescript
import { SkyTimepickerTimeFormatType } from '@skyux/datetime';

export interface MyComponentOptions {
  timeFormat?: SkyTimepickerTimeFormatType;  // Explicitly 'hh' | 'HH'
}

// Component usage
public config: MyComponentOptions = {
  timeFormat: 'hh'  // TypeScript only allows 'hh' or 'HH'
};
```

## Migration Instructions

Use this prompt with your AI coding assistant to automatically update your TypeScript interfaces and type declarations:

---

**PROMPT:**

I need to update my TypeScript code to use the new SKY UX type aliases that replaced generic `string` types. Many SKY UX component properties now use explicit type aliases (string union types) instead of the generic `string` type.

## Changes to Make

### 1. Update Interface and Type Property Declarations

Find all interface and type declarations in my codebase that have properties using SKY UX components, and update properties that previously used `string` to use the appropriate type alias.

**Pattern to find:**

- Interface properties typed as `string | undefined` or `string`
- Type alias properties typed as `string | undefined` or `string`
- Class properties typed as `string | undefined` or `string`
- That correspond to SKY UX component inputs

**Common properties affected:**

- `timeFormat` → use `SkyTimepickerTimeFormatType` (from `@skyux/datetime`)
- `buttonType` → use `SkyDropdownButtonType` (from `@skyux/popovers`)
- `buttonStyle` → use `SkyDropdownButtonStyleType` (from `@skyux/popovers`)
- `triggerType` → use `SkyDropdownTriggerType` (from `@skyux/popovers`)
- `popoverType` → use `SkyPopoverType` (from `@skyux/popovers`)
- `layout` → use `SkyTabLayoutType` (from `@skyux/tabs`)
- `navButtonType` → use `SkyTabsetNavButtonType` (from `@skyux/tabs`)
- `expandMode` → use `SkyRepeaterExpandModeType` (from `@skyux/lists`)
- `role` → use `SkyRepeaterRoleType` (from `@skyux/lists`)
- `searchExpandMode` → use `SkySearchExpandModeType` (from `@skyux/lookup`)
- `selectMode` → use `SkyLookupSelectModeType` (from `@skyux/lookup`)
- `closeReason` → use `SkySelectionModalCloseReasonType` (from `@skyux/lookup`)
- `size` → use `SkyModalConfigurationSizeType` (from `@skyux/modals`)
- `gutterSize` → use `SkyFluidGridGutterSizeType` (from `@skyux/layout`)
- `alignItems` → use `SkyActionButtonContainerAlignItemsType` (from `@skyux/layout`)
- `layoutType` → use `SkyPageLayoutType` (from `@skyux/pages`)
- `dockType` → use `SkySplitViewDockType` (from `@skyux/split-view`) or `SkyDataManagerDockType` (from `@skyux/data-manager`)
- `radioType` → use `SkyRadioType` (from `@skyux/forms`)
- `selectionBoxAlignItems` → use `SkySelectionBoxGridAlignItemsType` (from `@skyux/forms`)
- `indicatorType` → use `SkyIndicatorIconType` (from `@skyux/indicators`)
- `labelType` → use `SkyLabelType` (from `@skyux/indicators`)
- `keyInfoLayout` → use `SkyKeyInfoLayoutType` (from `@skyux/indicators`)
- `errorType` → use `SkyErrorType` (from `@skyux/errors`)
- `iconVariant` → use `SkyIconVariantType` (from `@skyux/icon`)
- `inlineFormButtonStyle` → use `SkyInlineFormButtonConfigStyleType` (from `@skyux/inline-form`)
- `colorpickerAlphaChannel` → use `SkyColorpickerAlphaChannelType` (from `@skyux/colorpicker`)
- `outputFormat` → use `SkyColorpickerOutputFormatType` (from `@skyux/colorpicker`)
- `linkWindowOptions` → use `SkyTextEditorLinkWindowOptionsType` (from `@skyux/text-editor`)
- `menuType` → use `SkyTextEditorMenuType` (from `@skyux/text-editor`)

### 2. Add Necessary Imports

Add the appropriate import statements for each type alias used:

```typescript
// Examples:
import { SkyTimepickerTimeFormatType } from '@skyux/datetime';
import { SkyRepeaterExpandModeType } from '@skyux/lists';
import { SkyModalConfigurationSizeType } from '@skyux/modals';
import {
  SkyDropdownButtonStyleType,
  SkyDropdownButtonType,
} from '@skyux/popovers';
import { SkyTabLayoutType } from '@skyux/tabs';
```

### 3. Update Type Annotations on Variables

Update any variable declarations that are typed as `string` but hold SKY UX component property values:

```typescript
// Before:
public timeFormat: string = 'hh';
public buttonType: string | undefined;
let layout: string = 'blocks';

// After:
public timeFormat: SkyTimepickerTimeFormatType = 'hh';
public buttonType: SkyDropdownButtonType | undefined;
let layout: SkyTabLayoutType = 'blocks';
```

### 4. Update Function Parameters and Return Types

Update function signatures that accept or return these values:

```typescript
// Before:
function setTimeFormat(format: string): void {}
function getLayout(): string | undefined {}

// After:
function setTimeFormat(format: SkyTimepickerTimeFormatType): void {}
function getLayout(): SkyTabLayoutType | undefined {}
```

## Type Alias Reference

For each affected property, use the following type imports:

| Property Pattern                       | Type Alias                               | Package               |
| -------------------------------------- | ---------------------------------------- | --------------------- |
| `timeFormat`                           | `SkyTimepickerTimeFormatType`            | `@skyux/datetime`     |
| `buttonType` (dropdown)                | `SkyDropdownButtonType`                  | `@skyux/popovers`     |
| `buttonStyle`                          | `SkyDropdownButtonStyleType`             | `@skyux/popovers`     |
| `triggerType`                          | `SkyDropdownTriggerType`                 | `@skyux/popovers`     |
| `popoverType`, `type` (popover)        | `SkyPopoverType`                         | `@skyux/popovers`     |
| `layout` (tab)                         | `SkyTabLayoutType`                       | `@skyux/tabs`         |
| `navButtonType`, `buttonType` (tabset) | `SkyTabsetNavButtonType`                 | `@skyux/tabs`         |
| `expandMode`                           | `SkyRepeaterExpandModeType`              | `@skyux/lists`        |
| `role` (repeater)                      | `SkyRepeaterRoleType`                    | `@skyux/lists`        |
| `expandMode` (search)                  | `SkySearchExpandModeType`                | `@skyux/lookup`       |
| `selectMode`                           | `SkyLookupSelectModeType`                | `@skyux/lookup`       |
| `closeReason`                          | `SkySelectionModalCloseReasonType`       | `@skyux/lookup`       |
| `size`                                 | `SkyModalConfigurationSizeType`          | `@skyux/modals`       |
| `gutterSize`                           | `SkyFluidGridGutterSizeType`             | `@skyux/layout`       |
| `alignItems` (action button)           | `SkyActionButtonContainerAlignItemsType` | `@skyux/layout`       |
| `layout` (page)                        | `SkyPageLayoutType`                      | `@skyux/pages`        |
| `dockType` (split view)                | `SkySplitViewDockType`                   | `@skyux/split-view`   |
| `dockType` (data manager)              | `SkyDataManagerDockType`                 | `@skyux/data-manager` |
| `type` (radio)                         | `SkyRadioType`                           | `@skyux/forms`        |
| `alignItems` (selection box)           | `SkySelectionBoxGridAlignItemsType`      | `@skyux/forms`        |
| `type` (indicator)                     | `SkyIndicatorIconType`                   | `@skyux/indicators`   |
| `type` (label)                         | `SkyLabelType`                           | `@skyux/indicators`   |
| `layout` (key info)                    | `SkyKeyInfoLayoutType`                   | `@skyux/indicators`   |
| `errorType`                            | `SkyErrorType`                           | `@skyux/errors`       |
| `variant`                              | `SkyIconVariantType`                     | `@skyux/icon`         |
| `styleType` (inline form button)       | `SkyInlineFormButtonConfigStyleType`     | `@skyux/inline-form`  |
| `alphaChannel`                         | `SkyColorpickerAlphaChannelType`         | `@skyux/colorpicker`  |
| `outputFormat`                         | `SkyColorpickerOutputFormatType`         | `@skyux/colorpicker`  |
| `linkWindowOptions`                    | `SkyTextEditorLinkWindowOptionsType`     | `@skyux/text-editor`  |
| `menuType`                             | `SkyTextEditorMenuType`                  | `@skyux/text-editor`  |

## What to Look For

1. **Interface properties** in your data models or configuration objects
2. **Class properties** typed as `string` that hold component input values
3. **Function parameters** that accept these string values
4. **Function return types** that return these string values
5. **Type aliases** that include these properties
6. **Generic type parameters** that might constrain these properties

## What NOT to Change

- String properties that are genuinely free-form text (not specific component inputs)
- String literals in templates (the template syntax remains the same)
- Any properties not listed in the table above
- Properties from non-SKY UX components

## Example Complete Migration

**Before:**

```typescript
import { Component } from '@angular/core';

export interface TimePickerConfig {
  timeFormat?: string;
  returnFormat?: string;
}

@Component({
  selector: 'app-time-selector',
  template: `<sky-timepicker>
    <input
      type="text"
      [skyTimepickerInput]="timepicker"
      [timeFormat]="config.timeFormat"
    />
  </sky-timepicker>`,
})
export class TimeSelectorComponent {
  public config: TimePickerConfig = {
    timeFormat: 'HH',
  };

  public setFormat(format: string): void {
    this.config.timeFormat = format;
  }
}
```

**After:**

```typescript
import { Component } from '@angular/core';
import { SkyTimepickerTimeFormatType } from '@skyux/datetime';

export interface TimePickerConfig {
  timeFormat?: SkyTimepickerTimeFormatType;
  returnFormat?: string; // This remains string - it's free-form
}

@Component({
  selector: 'app-time-selector',
  template: `<sky-timepicker>
    <input
      type="text"
      [skyTimepickerInput]="timepicker"
      [timeFormat]="config.timeFormat"
    />
  </sky-timepicker>`,
})
export class TimeSelectorComponent {
  public config: TimePickerConfig = {
    timeFormat: 'HH',
  };

  public setFormat(format: SkyTimepickerTimeFormatType): void {
    this.config.timeFormat = format;
  }
}
```

## Validation

After making these changes:

1. Run TypeScript compilation: `npm run build` or `tsc`
2. Look for type errors indicating incompatible string assignments
3. Verify IntelliSense now shows the specific valid values
4. Ensure all tests still pass: `npm test`

## Benefits

After this migration, you'll get:

- ✅ Compile-time validation of property values
- ✅ Better IntelliSense autocomplete in your IDE
- ✅ Explicit documentation of valid values in type signatures
- ✅ Protection against typos and invalid values
- ✅ Easier refactoring with type safety

---

**END PROMPT**

## Additional Resources

- [TypeScript String Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [TypeScript Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [SKY UX Breaking Changes Guide](../../CHANGELOG.md)

## Questions or Issues?

If you encounter properties that seem to need migration but aren't listed in the table above, or if you're unsure whether a particular property should be migrated, please:

1. Check the SKY UX component documentation
2. Look at the component's TypeScript definition files
3. Consult the CHANGELOG for the specific version
4. Open an issue in the SKY UX repository
