/**
 * The subset of a column option needed to reconcile column state. Both
 * `SkyDataManagerColumnPickerOption` and `SkyDataColumnOption` satisfy it.
 * @internal
 */
export interface SkyDataManagerColumnStateOption {
  alwaysDisplayed?: boolean;
  id: string;
  initialHide?: boolean;
}

/**
 * The set of columns a data manager knows about and which of them display.
 * @internal
 */
export interface SkyDataManagerColumnState {
  /**
   * The IDs of every column known about, whether displayed or not.
   */
  columnIds: string[];
  /**
   * The IDs of the columns that display, in display order.
   */
  displayedColumnIds: string[];
}

/**
 * Reconciles a stored column state, such as one restored from sticky settings,
 * against the columns that currently exist.
 *
 * A column the user hid and a column added since the state was stored are both
 * absent from `displayedColumnIds`, so `columnIds` — the columns known when the
 * state was stored — is what distinguishes them.
 *
 * @internal
 */
export function reconcileColumnState(
  stored: Partial<SkyDataManagerColumnState> | undefined,
  columnOptions: SkyDataManagerColumnStateOption[],
): SkyDataManagerColumnState {
  const columnIds = columnOptions.map((option) => option.id);
  const previouslyKnown = new Set(stored?.columnIds ?? []);
  const storedDisplayed = stored?.displayedColumnIds ?? [];

  if (previouslyKnown.size === 0 && storedDisplayed.length === 0) {
    // Nothing was stored, so fall back to the columns' declared visibility.
    return {
      columnIds,
      displayedColumnIds: columnOptions
        .filter((option) => option.alwaysDisplayed || !option.initialHide)
        .map((option) => option.id),
    };
  }

  // Drop columns that no longer exist.
  const available = new Set(columnIds);
  const displayedColumnIds = storedDisplayed.filter((id) => available.has(id));
  const displayed = new Set(displayedColumnIds);

  // A column that did not exist when the state was stored is new, so display it
  // unless it is meant to start hidden. When `columnIds` was never stored there
  // is no way to tell a new column from one the user hid, so the stored list is
  // taken at face value.
  if (previouslyKnown.size > 0) {
    for (const option of columnOptions) {
      if (
        !previouslyKnown.has(option.id) &&
        !displayed.has(option.id) &&
        !option.initialHide
      ) {
        displayedColumnIds.push(option.id);
        displayed.add(option.id);
      }
    }
  }

  // Columns that can never be hidden always display, and display first.
  for (const option of [...columnOptions].reverse()) {
    if (option.alwaysDisplayed && !displayed.has(option.id)) {
      displayedColumnIds.unshift(option.id);
      displayed.add(option.id);
    }
  }

  return { columnIds, displayedColumnIds };
}
