import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerResourcesModule } from '../../shared/sky-data-manager-resources.module';
import { SkyDataManagerToolbarComponent } from '../data-manager-toolbar/data-manager-toolbar.component';
import { SkyDataManagerComponent } from '../data-manager.component';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataViewComponent } from '../data-view.component';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerColumnPickerSortStrategy } from '../models/data-manager-column-picker-sort-strategy';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewConfig } from '../models/data-view-config';

import { SkyDataManagerColumnPickerContext } from './data-manager-column-picker-context';

/**
 * @internal
 */
interface Column extends SkyDataManagerColumnPickerOption {
  isSelected: boolean;
}

/**
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-data-manager-column-picker',
  templateUrl: './data-manager-column-picker.component.html',
  styleUrls: ['./data-manager-column-picker.component.scss'],
  providers: [SkyDataManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyDataManagerComponent,
    SkyDataManagerResourcesModule,
    SkyDataManagerToolbarComponent,
    SkyDataViewComponent,
    SkyModalModule,
    SkyRepeaterModule,
    SkyStatusIndicatorModule,
  ],
})
export class SkyDataManagerColumnPickerComponent implements OnDestroy, OnInit {
  public get dataState(): SkyDataManagerState {
    return this.#_dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this.#_dataState = value;
    this.updateData();
  }

  public columnData: Column[] = [];
  public displayedColumnData: Column[] = [];
  public viewConfig: SkyDataViewConfig = {
    id: 'columnPicker',
    name: 'Column Picker',
    searchEnabled: true,
    searchExpandMode: 'fit',
    multiselectToolbarEnabled: true,
    onSelectAllClick: this.selectAll.bind(this),
    onClearAllClick: this.clearAll.bind(this),
  };

  public isAnyDisplayedColumnSelected = false;

  #ngUnsubscribe = new Subject<void>();

  #_dataState = new SkyDataManagerState({});

  public readonly context = inject(SkyDataManagerColumnPickerContext);
  protected readonly dataManagerService = inject(SkyDataManagerService);
  protected readonly instance = inject(SkyModalInstance);

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.viewConfig.id,
      dataManagerConfig: {},
      defaultDataState: this.dataState,
    });
    this.dataManagerService.initDataView(this.viewConfig);

    this.columnData = this.#formatColumnOptions();

    this.dataManagerService
      .getDataStateUpdates('columnPicker')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.dataState = state;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public updateData(): void {
    this.displayedColumnData = this.searchColumns(
      this.columnData.filter((col) => !col.alwaysDisplayed)
    );

    if (this.dataState.onlyShowSelected) {
      this.displayedColumnData = this.displayedColumnData.filter(
        (col) => col.isSelected
      );
    }

    this.isAnyDisplayedColumnSelected = this.displayedColumnData.some(
      (col) => col.isSelected
    );
  }

  public searchColumns(columns: Column[]): Column[] {
    let searchedColumns = columns;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedColumns = columns.filter((item) => {
        for (const property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'label' || property === 'description')
          ) {
            const propertyText = item[property]?.toUpperCase();
            if (propertyText && propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedColumns;
  }

  public selectAll(): void {
    this.displayedColumnData.forEach((column) => (column.isSelected = true));
    this.updateData();
  }

  public clearAll(): void {
    this.displayedColumnData.forEach((column) => (column.isSelected = false));
    this.updateData();
  }

  public onIsSelectedChange(): void {
    this.updateData();
  }

  public cancelChanges(): void {
    this.instance.cancel();
  }

  public isSelected(id: string): boolean {
    return (
      this.context.displayedColumnIds.findIndex((colId) => colId === id) !== -1
    );
  }

  public applyChanges(): void {
    this.instance.save(
      this.columnData.filter((col) => col.isSelected || col.alwaysDisplayed)
    );
  }

  #formatColumnOptions(): Column[] {
    const allColumnOptions = this.context.columnOptions;
    const visibleColumnIds = this.context.displayedColumnIds;
    let formattedColumnOptions: Column[] = [];
    const unselectedColumnOptions: Column[] = [];

    for (const columnOption of allColumnOptions) {
      // format the column with the properties the column picker needs
      const colIndex = visibleColumnIds.indexOf(columnOption.id);
      const formattedColumn: Column = {
        alwaysDisplayed: columnOption.alwaysDisplayed,
        id: columnOption.id,
        label: columnOption.label,
        description: columnOption.description,
        isSelected: colIndex !== -1,
      };

      // if column picker sorting is currently enabled sort columns by order displayed then alphabetical
      // else display column in order they were specified in the columnOptions
      if (
        this.context.columnPickerSortStrategy ===
        SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical
      ) {
        if (formattedColumn.isSelected) {
          formattedColumnOptions[colIndex] = formattedColumn;
        } else {
          unselectedColumnOptions.push(formattedColumn);
        }
      } else {
        formattedColumnOptions.push(formattedColumn);
      }
    }

    // if column picker sorting is enabled, sort the columns that are not currently displayed
    // and add them after the currently displayed options
    if (
      this.context.columnPickerSortStrategy ===
      SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical
    ) {
      unselectedColumnOptions.sort((col1, col2) =>
        col1.label.localeCompare(col2.label)
      );
      formattedColumnOptions = formattedColumnOptions.concat(
        unselectedColumnOptions
      );
    }

    return formattedColumnOptions;
  }
}
