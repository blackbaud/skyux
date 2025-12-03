import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyBackToTopMessage, SkyBackToTopModule } from '@skyux/layout';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { SkyDataManagerService } from '../data-manager/data-manager.service';
import { SkyDataManagerConfig } from '../data-manager/models/data-manager-config';
import { SkyDataManagerSortOption } from '../data-manager/models/data-manager-sort-option';
import { SkyDataManagerState } from '../data-manager/models/data-manager-state';
import { SkyDataManagerStateOptions } from '../data-manager/models/data-manager-state-options';
import { SkyDataViewConfig } from '../data-manager/models/data-view-config';
import { SkyDataManagerDockType } from '../data-manager/types/data-manager-dock-type';

import { SkyStandaloneDataViewComponent } from './data-view.component';

@Component({
  selector: 'sky-data-manager[labelText]',
  imports: [SkyBackToTopModule, SkyViewkeeperModule],
  templateUrl: './data-manager.component.html',
  styleUrl: './data-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class SkyStandaloneDataManagerComponent {
  /**
   * A descriptor for the data that the data manager manipulates. Use a plural term. The descriptor helps set the data manager's `aria-label` attributes for multiselect toolbars, search inputs, sort buttons, and filter buttons to provide text equivalents for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * For example, when the descriptor is "constituents," the search input's `aria-label` is "Search constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  public readonly labelText = input<string>();

  public readonly activeViewId = model<string>();

  public readonly defaultDataState = input<SkyDataManagerStateOptions>({});

  public readonly settingsKey = input<string>();

  public readonly sortOptions = input<SkyDataManagerSortOption[]>([]);

  public readonly additionalOptions = input<unknown>();

  public readonly searchText = model<string>('');

  public readonly selectedIds = model<string[]>([]);

  public readonly additionalData = model<unknown>();

  /**
   * How the data manager docks to the page. Use `fill` to dock the data manager
   * to the container's size where the container is a `sky-page` component with
   * its `layout` set to `fit`, or where the container is another element with
   * a `relative` or `absolute` position and a fixed size.
   * `sky-data-manager-toolbar` will be docked to the top of all other content.
   * @default "none"
   */
  public readonly dock = input<SkyDataManagerDockType>('none');

  public readonly dataManagerState = output<SkyDataManagerState>();

  protected readonly backToTopController = new Subject<SkyBackToTopMessage>();

  protected readonly dockClass = computed(
    () => 'sky-data-manager-dock-' + this.dock(),
  );

  protected readonly dataViews = contentChildren(
    SkyStandaloneDataViewComponent,
  );
  protected readonly initialized = signal(false);

  readonly #cdr = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService, { self: true });
  readonly #dataViews = toSignal(
    this.#dataManagerService.getDataViewsUpdates(),
    { initialValue: [] },
  );
  readonly #dataManagerConfig = computed<SkyDataManagerConfig>(() => ({
    additionalOptions: this.additionalOptions(),
    listDescriptor: this.labelText(),
    sortOptions: this.sortOptions(),
  }));
  readonly #activeViewId = toSignal(
    this.#dataManagerService.getActiveViewIdUpdates(),
  );
  readonly #dataState = toSignal(
    this.#dataManagerService.getDataStateUpdates('dataState'),
  );
  readonly #searchTextUpdates = toSignal(
    this.#dataManagerService
      .getDataStateUpdates('searchTextUpdates', {
        properties: ['searchText'],
      })
      .pipe(map(({ searchText }) => searchText ?? '')),
    { initialValue: '' },
  );
  readonly #selectedIdsUpdates = toSignal(
    this.#dataManagerService
      .getDataStateUpdates('selectedIdsUpdates', {
        properties: ['selectedIds'],
      })
      .pipe(map(({ selectedIds }) => selectedIds ?? [])),
    { initialValue: [] },
  );
  readonly #additionalDataUpdates = toSignal(
    this.#dataManagerService
      .getDataStateUpdates('additionalDataUpdates', {
        properties: ['additionalData'],
      })
      .pipe(map(({ additionalData }) => additionalData)),
  );
  readonly #viewkeeperClasses = toSignal(
    this.#dataManagerService.viewkeeperClasses,
  );

  protected readonly currentViewkeeperClasses = computed(() => {
    const activeViewId = this.#activeViewId();
    const viewkeeperClasses = this.#viewkeeperClasses();
    return viewkeeperClasses?.[activeViewId ?? ''] ?? [];
  });

  constructor() {
    const initializer = effect(() => {
      const dataViews = this.dataViews();
      const activeViewId = this.activeViewId();
      if (activeViewId) {
        this.#dataManagerService.initDataManager({
          activeViewId,
          defaultDataState: new SkyDataManagerState({
            views: dataViews.map((vw) => ({
              viewId: `${vw.viewId()}`,
              columnIds: vw.columnOptions()?.map((col) => col.id),
              displayedColumnIds: vw
                .columnOptions()
                ?.filter((col) => !col.initialHide)
                .map((col) => col.id),
            })),
            ...(this.defaultDataState() ?? {}),
          }),
          dataManagerConfig: this.#dataManagerConfig(),
          settingsKey: this.settingsKey(),
        });
        this.initialized.set(true);
        initializer.destroy();
        this.#cdr.markForCheck();
      }
    });
    effect(() => {
      const initialized = untracked(this.initialized);
      const dataManagerConfig = this.#dataManagerConfig();
      if (initialized) {
        this.#dataManagerService.updateDataManagerConfig(dataManagerConfig);
      }
    });
    effect(() => {
      const activeViewId =
        this.#activeViewId() ?? untracked(() => this.dataViews()[0]?.viewId());
      if (activeViewId && activeViewId !== this.activeViewId()) {
        this.activeViewId.set(activeViewId);
        setTimeout(() => {
          this.#dataManagerService.updateActiveViewId(activeViewId);
          this.#cdr.markForCheck();
        });
      }
    });

    effect(() => {
      const dataViews = this.dataViews();
      const dataViewConfigs = this.#dataViews();
      const dataViewIds = dataViewConfigs.map((item) => item.id);
      dataViews.forEach((vw) => {
        const viewConfig: SkyDataViewConfig = {
          id: `${vw.viewId()}`,
          name: `${vw.labelText()}`,
          columnOptions: vw.columnOptions(),
          columnPickerEnabled: vw.columnPickerEnabled(),
          columnPickerSortStrategy: vw.columnPickerSortStrategy(),
          filterButtonEnabled: vw.filterButtonEnabled(),
          iconName: vw.iconName(),
          multiselectToolbarEnabled: vw.multiselectToolbarEnabled(),
          onClearAllClick: vw.onClearAllClick(),
          onSelectAllClick: vw.onSelectAllClick(),
          searchEnabled: vw.searchEnabled(),
          searchExpandMode: vw.searchExpandMode(),
          searchHighlightEnabled: vw.searchHighlightEnabled(),
          searchPlaceholderText: vw.searchPlaceholderText(),
          showFilterButtonText: vw.showFilterButtonText(),
          showSortButtonText: vw.showSortButtonText(),
          sortEnabled: vw.sortEnabled(),
        };
        if (!dataViewIds.includes(`${vw.viewId()}`)) {
          this.#dataManagerService.initDataView(viewConfig);
        } else {
          this.#dataManagerService.updateViewConfig(viewConfig);
        }
      });
      this.#cdr.markForCheck();
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
        this.#dataManagerService.updateDataState(
          new SkyDataManagerState({
            ...(untracked(this.#dataState) ?? untracked(this.defaultDataState)),
            additionalData,
          }),
          'additionalDataUpdates',
        );
      }
    });

    effect(() => {
      const searchText = untracked(this.searchText);
      const searchTextUpdates = this.#searchTextUpdates();
      if (searchText !== searchTextUpdates) {
        this.searchText.set(searchTextUpdates);
      }
    });
    effect(() => {
      const searchText = this.searchText();
      const searchTextUpdates = untracked(this.#searchTextUpdates);
      if (searchText !== searchTextUpdates) {
        this.#dataManagerService.updateDataState(
          new SkyDataManagerState({
            ...(untracked(this.#dataState) ?? untracked(this.defaultDataState)),
            searchText,
          }),
          'searchTextUpdates',
        );
      }
    });

    effect(() => {
      const selectedIds = untracked(this.selectedIds);
      const selectedIdsUpdates = this.#selectedIdsUpdates();
      if (selectedIds !== selectedIdsUpdates) {
        this.selectedIds.set(selectedIdsUpdates);
      }
    });
    effect(() => {
      const selectedIds = this.selectedIds();
      const selectedIdsUpdates = untracked(this.#selectedIdsUpdates);
      if (selectedIds !== selectedIdsUpdates) {
        this.#dataManagerService.updateDataState(
          new SkyDataManagerState({
            ...(untracked(this.#dataState) ?? untracked(this.defaultDataState)),
            selectedIds,
          }),
          'selectedIdsUpdates',
        );
      }
    });

    effect(() => {
      const dataState = this.#dataState();
      if (dataState) {
        this.dataManagerState.emit(dataState);
      }
    });
  }
}
