import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { SkyLogService, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyTextHighlightDirective } from '@skyux/indicators';

import { EMPTY, filter, map, of, switchMap } from 'rxjs';

import { SkyDataManagerService } from '../data-manager/data-manager.service';
import { SkyDataManagerColumnPickerOption } from '../data-manager/models/data-manager-column-picker-option';
import { SkyDataManagerColumnPickerSortStrategy } from '../data-manager/models/data-manager-column-picker-sort-strategy';
import { SkyDataManagerState } from '../data-manager/models/data-manager-state';

@Component({
  selector: 'sky-data-view[labelText]',
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyResponsiveHostDirective, SkyTextHighlightDirective],
  host: {
    '[attr.data-view-id]': 'viewId()',
  },
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SkyStandaloneDataViewComponent {
  /**
   * The name of the view. This is used in the ARIA label for the view switcher.
   */
  public readonly labelText = input<string>();

  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */
  public readonly viewId = input<string>();

  /**
   * The column data to pass to the column picker. Columns that are always displayed should be
   * passed in addition to the optional columns. See SkyDataManagerColumnPickerOption.
   */
  public readonly columnOptions = model<SkyDataManagerColumnPickerOption[]>([]);

  /**
   * Whether to display the column picker button for this view.
   */
  public readonly columnPickerEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The strategy used to sort the options in the column picker. If no strategy is provided the columns will be sorted
   * by selected then alphabetical.
   */
  public readonly columnPickerSortStrategy =
    input<SkyDataManagerColumnPickerSortStrategy>();

  /**
   * Whether to display the filter button for this view.
   */
  public readonly filterButtonEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The name of the Blackbaud SVG icon to display for this view in the view switcher.
   * Required if you have more than one view.
   */
  public readonly iconName = input<string>();

  /**
   * Whether to display the multiselect toolbar for this view.
   */
  public readonly multiselectToolbarEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The function called when a user selects the "Clear all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is not selected in this function.
   */
  public readonly onClearAllClick = model<() => void>();

  /**
   * The function called when a user selects the "Select all" button on the multi-select toolbar.
   * Update your displayed data to indicate it is selected in this function.
   */
  public readonly onSelectAllClick = model<() => void>();

  /**
   * Whether to display the search box for this view.
   */
  public readonly searchEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public readonly searchText = output<string>();

  /**
   * Placeholder text to display in the search input until users enter search criteria.
   * See the [search component](https://developer.blackbaud.com/skyux/components/search) for the default value.
   */
  public readonly searchPlaceholderText = input<string>();

  /**
   * Sets the `expandMode` property on the search box for this view.
   * See the [search component](https://developer.blackbaud.com/skyux/components/search) for valid options and the default value.
   */
  public readonly searchExpandMode = input<string>();

  /**
   * Highlights text that matches the search text using the text highlight directive.
   */
  public readonly searchHighlightEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to include the "Filter" text on the displayed filter button for this view.
   * If it is not set, no text appears.
   */
  public readonly showFilterButtonText = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to include the "Sort" text on the displayed sort button for this view.
   * If it is not set, no text appears.
   */
  public readonly showSortButtonText = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to display the sort button in this view.
   */
  public readonly sortEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public readonly selectedIds = model<string[]>([]);

  public readonly additionalData = model<unknown>();

  public readonly state = output<SkyDataManagerState>();

  readonly #dataManagerService = inject(SkyDataManagerService, {
    optional: true,
  });
  readonly #activeViewIdUpdates = toSignal(
    this.#dataManagerService?.getActiveViewIdUpdates() ?? of(undefined),
  );
  readonly #viewIdObs = toObservable(this.viewId);
  readonly #dataViewConfig = toSignal(
    this.#viewIdObs.pipe(
      filter((id): id is string => !!id),
      map((id) => this.#dataManagerService?.getViewById(id)),
    ),
  );
  readonly #dataViewsUpdates = toSignal(
    this.#viewIdObs.pipe(
      filter((id): id is string => !!id),
      switchMap(
        (id) => this.#dataManagerService?.getDataStateUpdates(id) ?? EMPTY,
      ),
    ),
  );

  protected readonly isActive = computed(
    () => this.#activeViewIdUpdates() === this.viewId(),
  );

  protected readonly textHighlight = computed(() => {
    const config = this.#dataViewConfig();
    if (config?.searchHighlightEnabled) {
      const state = this.#dataViewsUpdates();
      return state?.searchText;
    } else {
      return '';
    }
  });

  readonly #cdr = inject(ChangeDetectorRef);
  readonly #additionalDataUpdates = toSignal(
    this.#dataManagerService
      ?.getDataStateUpdates('additionalDataUpdates', {
        properties: ['additionalData'],
      })
      .pipe(map(({ additionalData }) => additionalData)) ?? of(undefined),
  );
  readonly #dataState = toSignal(
    this.#dataManagerService?.getDataStateUpdates('dataState') ?? of(undefined),
  );
  readonly #selectedIdsUpdates = toSignal(
    this.#dataManagerService
      ?.getDataStateUpdates('selectedIdsUpdates', {
        properties: ['selectedIds'],
      })
      .pipe(map(({ selectedIds }) => selectedIds ?? [])) ?? of(undefined),
    { initialValue: [] },
  );

  constructor() {
    if (!this.#dataManagerService) {
      inject(SkyLogService).error(
        'The <sky-data-view> component must be wrapped inside a <sky-data-manager> component with a `labelText` attribute.',
      );
    }

    const textHighlight = inject(SkyTextHighlightDirective, { self: true });
    effect(() => {
      textHighlight.skyHighlight = this.textHighlight();
      this.#cdr.markForCheck();
    });

    this.#dataManagerService
      ?.getDataStateUpdates(`dataViewSearchText`, {
        properties: ['searchText'],
      })
      .pipe(takeUntilDestroyed())
      .subscribe(({ searchText }) => {
        this.searchText.emit(searchText ?? '');
      });

    this.#dataManagerService
      ?.getDataStateUpdates(`dataView`)
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        this.state.emit(state);
      });

    effect(() => {
      const additionalData = untracked(this.additionalData);
      const additionalDataUpdates = this.#additionalDataUpdates();
      if (additionalData !== additionalDataUpdates) {
        this.additionalData.set(additionalDataUpdates);
      }
    });
    effect(() => {
      const additionalData = this.additionalData();
      const additionalDataUpdates = untracked(this.#additionalDataUpdates);
      if (additionalData !== additionalDataUpdates) {
        this.#dataManagerService?.updateDataState(
          new SkyDataManagerState({
            ...(untracked(this.#dataState) ?? {}),
            additionalData,
          }),
          'dataViewAdditionalDataUpdates',
        );
      }
    });

    effect(() => {
      const selectedIds = untracked(this.selectedIds);
      const selectedIdsUpdates = this.#selectedIdsUpdates();
      if (
        typeof selectedIdsUpdates !== 'undefined' &&
        selectedIds !== selectedIdsUpdates
      ) {
        this.selectedIds.set(selectedIdsUpdates);
      }
    });
    effect(() => {
      const selectedIds = this.selectedIds();
      const selectedIdsUpdates = untracked(this.#selectedIdsUpdates);
      if (selectedIds !== selectedIdsUpdates) {
        this.#dataManagerService?.updateDataState(
          new SkyDataManagerState({
            ...(untracked(this.#dataState) ?? {}),
            selectedIds,
          }),
          'selectedIdsUpdates',
        );
      }
    });
  }
}
