import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';
import { SkyTextHighlightDirective } from '@skyux/indicators';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerComponent } from './data-manager.component';
import { SkyDataManagerService } from './data-manager.service';
import { SkyDataManagerColumnPickerSortStrategy } from './models/data-manager-column-picker-sort-strategy';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataViewConfig } from './models/data-view-config';

/**
 * A data view is rendered within a data manager component.
 * It can subscribe to data state changes from `SkyDataManagerService` and apply the filters,
 * search text, and more to the data it displays.
 */
@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyResponsiveHostDirective, SkyTextHighlightDirective],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SkyDataViewComponent implements OnDestroy, OnInit {
  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */
  @Input()
  public viewId: string | undefined;

  /**
   * Whether to display the column picker button for this view.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `columnPickerEnabled` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly columnPickerEnabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The strategy used to sort the options in the column picker. Use `none` to apply
   * no sorting, or `selectedThenAlphabetical` to display the selected columns before
   * the unselected columns and sort the unselected columns alphabetically.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `columnPickerSortStrategy` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @default "none"
   * @preview
   */
  public readonly columnPickerSortStrategy = input<
    'none' | 'selectedThenAlphabetical'
  >('none');

  /**
   * The name of the Blackbaud SVG icon to display for this view in the view switcher.
   * Required if the data manager has more than one view.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `iconName` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly iconName = input<string>();

  /**
   * The name of the view. This is used in the ARIA label for the view switcher.
   * Defaults to `viewId` when not set.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `name` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly viewName = input<string>();

  /**
   * The `expandMode` of the search box in `sky-data-manager-toolbar`.
   * See the [search component](https://developer.blackbaud.com/skyux/components/search) for valid options.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `searchExpandMode` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @default "responsive"
   * @preview
   */
  public readonly searchExpandMode = input<'responsive' | 'none' | 'fit'>(
    'responsive',
  );

  /**
   * Whether to display the search box in `sky-data-manager-toolbar`.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `searchEnabled` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly searchEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Placeholder text for the search box in `sky-data-manager-toolbar`.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `searchPlaceholderText` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly searchPlaceholderText = input<string>();

  /**
   * Whether to display the multiselect toolbar in `sky-data-manager-toolbar`.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `multiselectToolbarEnabled` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly multiselectEnabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to highlight text that matches the search text using the text highlight directive.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `searchHighlightEnabled` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly searchHighlightEnabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to include the "Sort" text on the sort button in `sky-data-manager-toolbar`.
   * Ignored when an ancestor provides `SkyDataManagerService`; set `showSortButtonText` on
   * the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly showSortButtonText = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Fires when a user selects the "Clear all" button on the multiselect toolbar.
   * Update your displayed data to indicate it is not selected.
   * Does not fire when an ancestor provides `SkyDataManagerService`; set `onClearAllClick`
   * on the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly clearAll = output<void>();

  /**
   * Fires when a user selects the "Select all" button on the multiselect toolbar.
   * Update your displayed data to indicate it is selected.
   * Does not fire when an ancestor provides `SkyDataManagerService`; set `onSelectAllClick`
   * on the `SkyDataViewConfig` passed to `initDataView()` instead.
   * @preview
   */
  public readonly selectAll = output<void>();

  @HostBinding('attr.data-view-id')
  public get dataViewId(): string | undefined {
    return this.viewId;
  }

  public get isActive(): boolean {
    return this.#_isActive;
  }

  public set isActive(value: boolean) {
    this.#_isActive = value;
    this.#changeDetector.markForCheck();
  }

  public get textHighlight(): string | undefined {
    return this.#_textHighlight;
  }

  public set textHighlight(value: string | undefined) {
    this.#_textHighlight = value;
    this.#textHighlight.skyHighlight = value;
    this.#changeDetector.markForCheck();
  }

  #_isActive = false;
  #_textHighlight: string | undefined;

  #ngUnsubscribe = new Subject<void>();
  #currentState: SkyDataManagerState | undefined;

  readonly #dataManager = inject(SkyDataManagerComponent, { optional: true });
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  #textHighlight: SkyTextHighlightDirective = inject(
    SkyTextHighlightDirective,
    { self: true },
  );
  readonly #columnPickerSortStrategy = computed(() => {
    const columnPickerSortStrategy = this.columnPickerSortStrategy();
    if (columnPickerSortStrategy === 'selectedThenAlphabetical') {
      return SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical;
    }
    return SkyDataManagerColumnPickerSortStrategy.None;
  });
  readonly #viewConfig = computed<SkyDataViewConfig | undefined>(
    () => {
      if (this.viewId) {
        return {
          id: this.viewId,
          name: this.viewName() ?? this.viewId,
          iconName: this.iconName(),
          searchEnabled: this.searchEnabled(),
          columnPickerEnabled: this.columnPickerEnabled(),
          columnPickerSortStrategy: this.#columnPickerSortStrategy(),
          searchPlaceholderText: this.searchPlaceholderText(),
          searchExpandMode: this.searchExpandMode(),
          multiselectToolbarEnabled: this.multiselectEnabled(),
          showSortButtonText: this.showSortButtonText(),
          onClearAllClick: (): void => this.clearAll.emit(),
          onSelectAllClick: (): void => this.selectAll.emit(),
          searchHighlightEnabled: this.searchHighlightEnabled(),
        };
      }
      return undefined;
    },
    {
      equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
  );
  #viewRegistered = false;

  constructor() {
    effect(() => {
      const viewConfig = this.#viewConfig();
      if (this.#viewRegistered && viewConfig) {
        this.#dataManagerService.updateViewConfig({
          ...this.#dataManagerService.getViewById(viewConfig.id),
          ...viewConfig,
        });
      }
    });
  }

  public ngOnInit(): void {
    const viewConfig = this.#viewConfig();
    if (viewConfig) {
      this.#viewRegistered =
        this.#dataManager?.registerView(viewConfig) ?? false;
    }

    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.isActive = this.viewId === activeViewId;
      });

    this.#dataManagerService
      .getDataViewsUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateSearchHighlight(this.#currentState);
      });

    /* istanbul ignore else */
    if (this.viewId) {
      this.#dataManagerService
        .getDataStateUpdates(this.viewId)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.#currentState = state;
          this.#updateSearchHighlight(state);
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #updateSearchHighlight(state?: SkyDataManagerState): void {
    if (this.viewId) {
      const view = this.#dataManagerService.getViewById(this.viewId);

      if (view?.searchHighlightEnabled) {
        this.textHighlight = state?.searchText;
      } else if (this.textHighlight) {
        this.textHighlight = undefined;
      }
    }
  }
}
