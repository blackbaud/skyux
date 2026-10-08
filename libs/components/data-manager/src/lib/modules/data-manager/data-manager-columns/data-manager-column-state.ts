import { SkyDataColumnOption } from '@skyux/lists';

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
  columnOptions: readonly SkyDataColumnOption[],
): SkyDataManagerColumnState {
  const columnIds = columnOptions.map((option) => option.id);
  const knownIds = stored?.columnIds ?? [];
  const storedDisplayedIds = stored?.displayedColumnIds ?? [];

  // Keep the stored columns that still exist, in their stored order.
  const keptIds = storedDisplayedIds.filter((id) => columnIds.includes(id));

  // A column missing from the stored `columnIds` is new, so it displays unless
  // it starts hidden; with nothing stored, every column is new. When only
  // `displayedColumnIds` was stored, a new column cannot be told apart from
  // one the user hid, so none are added.
  const canAddColumns = knownIds.length > 0 || storedDisplayedIds.length === 0;
  const addedIds = canAddColumns
    ? columnOptions
        .filter(
          (option) =>
            !option.initialHide &&
            !knownIds.includes(option.id) &&
            !keptIds.includes(option.id),
        )
        .map((option) => option.id)
    : [];

  // Columns that can never be hidden always display, and display first.
  const displayedIds = [...keptIds, ...addedIds];
  const alwaysDisplayedIds = columnOptions
    .filter(
      (option) => option.alwaysDisplayed && !displayedIds.includes(option.id),
    )
    .map((option) => option.id);

  return {
    columnIds,
    displayedColumnIds: [...alwaysDisplayedIds, ...displayedIds],
  };
}
