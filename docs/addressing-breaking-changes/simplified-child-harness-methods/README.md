# SKY UX Harness API Migration Prompt

## Context

The SKY UX testing harness library has simplified the API for methods that return arrays of child harnesses. Previously, these methods would throw errors when filters were provided but no matching items were found. The new simplified pattern returns empty arrays instead, letting calling code handle the results appropriately.

## Migration Instructions

Use this prompt with your AI coding assistant to automatically update your unit tests:

---

**PROMPT:**

I need to update my Angular unit tests to work with the new SKY UX harness API. The harness methods that return arrays of child elements have changed from throwing errors to returning empty arrays when no matches are found with filters.

**Old Pattern (throws errors):**

```typescript
// This used to throw an error like "Unable to find any [items] with filter(s): {...}"
await expectAsync(
  harness.getItems({ text: 'Nonexistent Item' }),
).toBeRejectedWithError(
  'Unable to find any [items] with filter(s): {"text":"Nonexistent Item"}',
);

// Or with try-catch blocks:
try {
  const items = await harness.getItems({ text: 'Nonexistent Item' });
  fail('Expected error to be thrown');
} catch (error) {
  expect(error.message).toContain('Unable to find any [items] with filter(s):');
}
```

**New Pattern (returns empty arrays):**

```typescript
// Now returns empty array instead of throwing
const items = await harness.getItems({ text: 'Nonexistent Item' });
expect(items).toEqual([]);
expect(items.length).toBe(0);
```

**Please update my test files by:**

1. **Update parameter format changes** - Some harness methods have changed their parameter format as part of standardization:

```typescript
// OLD: String parameter for getTabButtonHarness
const tabButton = await tabsetHarness.getTabButtonHarness('Tab 1');

// NEW: Filters object parameter for getTabButtonHarness
const tabButton = await tabsetHarness.getTabButtonHarness({ tabHeading: 'Tab 1' });
```

2. **Remove tests that expect errors** - Delete any test cases that use `toBeRejected`, `toBeRejectedWithError`, or try-catch blocks expecting errors from the harness methods listed in the "Affected Harness Methods" section below.

   **Important:** These methods no longer throw errors when no matches are found with filters, so any tests expecting rejections from these methods should be removed or updated.

3. **Update existing test logic** - If any tests rely on the old error-throwing behavior, replace them with logic that checks for empty arrays:

```typescript
// OLD: Expecting any error when no matches found
await expectAsync(
  harness.getSomeItems({ filter: 'nonexistent' }),
).toBeRejected();

// OLD: Expecting specific error when no matches found
await expectAsync(
  harness.getSomeItems({ filter: 'nonexistent' }),
).toBeRejectedWithError('Unable to find any...');

// OLD: Using try-catch blocks
try {
  const items = await harness.getSomeItems({ filter: 'nonexistent' });
  fail('Expected error to be thrown');
} catch (error) {
  expect(error.message).toContain('Unable to find any');
}

// NEW: Expecting empty array when no matches found
const items = await harness.getSomeItems({ filter: 'nonexistent' });
expect(items).toEqual([]);
```

4. **Keep other error tests** - Do NOT remove tests that check for different types of errors like:
   - "Cannot get [item] because [component] is closed/collapsed/hidden"
   - "More than one [item] matches the filter(s)" (for single-item getter methods)
   - Business logic errors unrelated to filter matching

5. **Add new positive tests if needed** - Consider adding tests that verify the new behavior:

```typescript
it('should return empty array when no items match filters', async () => {
  const items = await harness.getItems({ someFilter: 'nonexistent' });
  expect(items).toEqual([]);
  expect(items.length).toBe(0);
});
```

6. **Update custom harness files** - If you have custom harness classes that use the affected SKY UX harness methods, update any error-handling logic in those files as well. The SKY UX methods will now return empty arrays instead of throwing errors, so your custom harnesses should handle this appropriately.

**Focus on these file patterns:**

- Any test files that import SKY UX harness classes
- Files with `.spec.ts` or `.test.ts` extensions
- Test files in your project that use harness methods
- Custom harness files that use SKY UX harness methods (e.g., `*-harness.ts`, `*.harness.ts`)

**Search for these patterns to find tests that need updating:**

- `getTabButtonHarness('` - Look for string parameters that need to be converted to filter objects
- `toBeRejected()` or `toBeRejectedWithError()` used with the affected harness methods listed above
- `toBeRejectedWithError` + `filter(s):`
- Error messages containing "Unable to find any" + "with filter(s):"
- Error messages containing "Could not find" + "matching filter(s):"
- Try-catch blocks around the affected harness methods that expect errors

---

## Affected Harness Methods

The following harness methods have been updated to use the new simplified pattern:

### Parameter Format Changes

Some harness methods have changed their parameter format for consistency:

#### Tabs

- `SkyTabsetHarness.getTabButtonHarness()` - Changed from string parameter to filters object:

  ```typescript
  // OLD
  await tabsetHarness.getTabButtonHarness('Tab 1');

  // NEW
  await tabsetHarness.getTabButtonHarness({ tabHeading: 'Tab 1' });
  ```

### Methods Returning Empty Arrays (Instead of Throwing Errors)

The following harness methods now return empty arrays instead of throwing errors when no matches are found with filters:

### Action Bars

- `SkySummaryActionBarSecondaryActionsHarness.getActions()`

### Data Manager

- `SkyDataManagerColumnPickerHarness.getColumns()`
- `SkyDataManagerHarness.getViews()`
- `SkyDataManagerToolbarHarness.getLeftItems()`
- `SkyDataManagerToolbarHarness.getPrimaryItems()`
- `SkyDataManagerToolbarHarness.getRightItems()`
- `SkyDataManagerToolbarHarness.getSections()`

## Filter Bar

- `SkyFilterBarHarness.getItems()`

### Forms

- `SkyCheckboxGroupHarness.getCheckboxes()`
- `SkyRadioGroupHarness.getRadioButtons()`
- `SkySelectionBoxGridHarness.getSelectionBoxes()`

### Inline Form

- `SkyInlineFormHarness.getButtons()`

### Layout

- `SkyActionButtonContainerHarness.getActionButtons()`
- `SkyDescriptionListHarnss.getContent()`
- `SkyToolbarHarness.getItems()`
- `SkyToolbarHarness.getSections()`
- `SkyToolbarSectionHarness.getItems()`

### Lists

- `SkyFilterInlineHarness.getItems()`
- `SkyFilterSummaryHarness.getItems()`
- `SkySortHarness.getItems()`

### Lookup

- `SkyAutocompleteHarness.getSearchResults()`
- `SkyCountryFieldHarness.getSearchResults()`
- `SkyLookupHarness.getSearchResults()`
- `SkySelectionModalHarness.getSearchResults()`

### Modals

- `SkyConfirmHarness.getCustomButtons()`

### Navigation

- `SkyNavbarHarness.getItems()`

### Pages

- `SkyActionHubHarness.getNeedsAttentionItems()`
- `SkyLinkListHarness.getListItems()`

### Popovers

- `SkyDropdownMenuHarness.getItems()`

### Progress Indicator

- `SkyProgressIndicatorHarness.getItems()`

### Tabs

- `SkySectionedFormHarness.getSections()`

### Tiles

- `SkyTileContentHarness.getSections()`
- `SkyTileDashboardHarness.getTiles()`

## Benefits of the New Pattern

1. **Predictable API** - Methods consistently return arrays, making the API easier to understand and use
2. **Better Error Handling** - Calling code can decide how to handle empty results appropriately for their use case
3. **Reduced Complexity** - Eliminates complex conditional error handling logic in harness methods
4. **More Flexible** - Tests can check for empty arrays without needing try/catch blocks

## Example Migration

**Before:**

```typescript
it('should throw error if no matching buttons found', async () => {
  await expectAsync(harness.getButtons({ text: 'Save' })).toBeRejectedWithError(
    'No button(s) found that match the given filter(s): {"text":"Save"}',
  );
});
```

**After:**

```typescript
it('should return empty array if no matching buttons found', async () => {
  const buttons = await harness.getButtons({ text: 'Save' });
  expect(buttons).toEqual([]);
});
```
