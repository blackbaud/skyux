import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyCheckboxChange } from '@skyux/forms';
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalService,
} from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerColumnPickerContext } from '../data-manager-column-picker/data-manager-column-picker-context';
import { SkyDataManagerColumnPickerService } from '../data-manager-column-picker/data-manager-column-picker.service';
import { SkyDataManagerFilterModalContext } from '../data-manager-filter-context';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerConfig } from '../models/data-manager-config';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewConfig } from '../models/data-view-config';

/**
 * Renders a `sky-toolbar` with the contents specified by the active view's `SkyDataViewConfig`
 * and the `SkyDataManagerToolbarLeftItemsComponent`, `SkyDataManagerToolbarRightItemsComponent`,
 * and `SkyDataManagerToolbarSectionComponent` wrappers.
 */
@Component({
  selector: 'sky-data-manager-toolbar',
  templateUrl: './data-manager-toolbar.component.html',
  styleUrls: ['./data-manager-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataManagerToolbarComponent implements OnDestroy, OnInit {
  public get activeView(): SkyDataViewConfig | undefined {
    return this.#_activeView;
  }

  public set activeView(value: SkyDataViewConfig | undefined) {
    this.#_activeView = value;
    this.#changeDetector.markForCheck();
  }

  public get dataManagerConfig(): SkyDataManagerConfig | undefined {
    return this.#_dataManagerConfig;
  }

  public set dataManagerConfig(value: SkyDataManagerConfig | undefined) {
    this.#_dataManagerConfig = value;
    this.#changeDetector.markForCheck();
  }

  public get dataState(): SkyDataManagerState | undefined {
    return this.#_dataState;
  }

  public set dataState(value: SkyDataManagerState | undefined) {
    this.#_dataState = value;
    if (value) {
      this.#dataManagerService.updateDataState(value, this.#_source);
    }
  }

  public get views(): SkyDataViewConfig[] {
    return this.#_views;
  }

  public set views(value: SkyDataViewConfig[]) {
    this.#_views = value;
    this.#changeDetector.markForCheck();
  }

  public onlyShowSelected: boolean | undefined;

  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;
  #dataManagerService: SkyDataManagerService;
  #modalService: SkyModalService;
  #columnPickerService: SkyDataManagerColumnPickerService;

  // the source to provide for data state changes
  #_source = 'toolbar';
  #_activeView: SkyDataViewConfig | undefined;
  #_dataManagerConfig: SkyDataManagerConfig | undefined;
  #_dataState: SkyDataManagerState | undefined;
  #_views: SkyDataViewConfig[] = [];

  constructor(
    changeDetector: ChangeDetectorRef,
    dataManagerService: SkyDataManagerService,
    modalService: SkyModalService,
    columnPickerService: SkyDataManagerColumnPickerService
  ) {
    this.#changeDetector = changeDetector;
    this.#dataManagerService = dataManagerService;
    this.#modalService = modalService;
    this.#columnPickerService = columnPickerService;
  }

  public ngOnInit(): void {
    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        /* istanbul ignore else */
        if (activeViewId) {
          this.activeView = this.#dataManagerService.getViewById(activeViewId);
          this.#changeDetector.markForCheck();
        }
      });

    this.#dataManagerService
      .getDataViewsUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((views) => {
        this.views = views;
        if (this.activeView) {
          this.activeView = this.#dataManagerService.getViewById(
            this.activeView.id
          );
        }
        this.#changeDetector.markForCheck();
      });

    this.#dataManagerService
      .getDataStateUpdates(this.#_source)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((dataState) => {
        this.#_dataState = dataState;
        this.onlyShowSelected = dataState.onlyShowSelected;
        this.#changeDetector.markForCheck();
      });

    this.#dataManagerService
      .getDataManagerConfigUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((config) => {
        this.dataManagerConfig = config;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public sortSelected(sortOption: SkyDataManagerSortOption): void {
    if (this.dataState) {
      this.dataState.activeSortOption = sortOption;
      this.#dataManagerService.updateDataState(this.dataState, this.#_source);
    }
  }

  public onViewChange(viewId: string): void {
    this.#dataManagerService.updateActiveViewId(viewId);
  }

  public searchApplied(text: string): void {
    if (this.dataState) {
      this.dataState.searchText = text;
      this.#dataManagerService.updateDataState(this.dataState, this.#_source);
    }
  }

  public filterButtonClicked(): void {
    const context = new SkyDataManagerFilterModalContext();
    const filterModal =
      this.dataManagerConfig && this.dataManagerConfig.filterModalComponent;

    context.filterData = this.dataState?.filterData;

    const options: SkyModalConfigurationInterface = {
      providers: [
        { provide: SkyDataManagerFilterModalContext, useValue: context },
      ],
      size: 'large',
    };

    if (filterModal) {
      const modalInstance = this.#modalService.open(filterModal, options);

      modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
        if (this.dataState && result.reason === 'save') {
          this.dataState.filterData = result.data;
          this.#dataManagerService.updateDataState(
            this.dataState,
            this.#_source
          );
        }
      });
    }
  }

  public openColumnPicker(): void {
    if (this.dataState && this.activeView && this.activeView.columnOptions) {
      const viewState = this.dataState.getViewStateById(this.activeView.id);
      if (viewState) {
        const context = new SkyDataManagerColumnPickerContext(
          this.activeView.columnOptions,
          viewState.displayedColumnIds
        );

        if (this.activeView.columnPickerSortStrategy) {
          context.columnPickerSortStrategy =
            this.activeView.columnPickerSortStrategy;
        }

        const options: SkyModalConfigurationInterface = {
          providers: [
            { provide: SkyDataManagerColumnPickerContext, useValue: context },
          ],
        };

        const modalInstance = this.#modalService.open(
          this.#columnPickerService.getComponentType(),
          options
        );

        modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
          if (result.reason === 'save') {
            const displayedColumnIds = result.data.map(
              (col: SkyDataManagerColumnPickerOption) => col.id
            );

            viewState.displayedColumnIds = displayedColumnIds;
            if (this.dataState && this.activeView) {
              this.dataState = this.dataState.addOrUpdateView(
                this.activeView.id,
                viewState
              );
            }
          }
        });
      }
    }
  }

  public selectAll(): void {
    /* istanbul ignore else */
    if (this.activeView?.onSelectAllClick) {
      this.activeView.onSelectAllClick();
    }
  }

  public clearAll(): void {
    /* istanbul ignore else */
    if (this.activeView?.onClearAllClick) {
      this.activeView.onClearAllClick();
    }
  }

  public onOnlyShowSelected(event: SkyCheckboxChange): void {
    if (this.dataState) {
      this.dataState.onlyShowSelected = !!event.checked;
      this.#dataManagerService.updateDataState(this.dataState, this.#_source);
    }
  }
}
