# @skyux/data-grid

`@skyux/data-grid` provides a declarative, signal-based data grid for displaying
tabular data. You supply a `data` array and one `<sky-data-grid-column>` for each
column, and the grid handles sorting, paging, multiselect, loading states, column
sizing, templates, and inline help. It is a simpler, higher-level alternative to the
deprecated `@skyux/grids` and `@skyux/list-builder` grid view, and to building directly
on the lower-level `@skyux/ag-grid` wrapper.

## When to use

- Reach for **`@skyux/data-grid`** when you want a straightforward grid driven by inputs
  and column declarations, with the common features (sorting, paging, selection, loading)
  built in.
- Reach for **`@skyux/ag-grid`** when you need direct access to AG Grid's full
  configuration and APIs for advanced scenarios this component does not cover.

## Documentation

See the [data grid documentation](https://developer.blackbaud.com/skyux/components/data-grid)
on the SKY UX developer center for the full API reference, demos, and code examples.

## Running unit tests

Run `nx test data-grid` to execute the unit tests.
