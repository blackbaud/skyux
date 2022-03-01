import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyModalInstance } from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from '../data-manager.service';
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
  selector: 'sky-data-manager-column-picker',
  templateUrl: './data-manager-column-picker.component.html',
  styleUrls: ['./data-manager-column-picker.component.scss'],
  providers: [SkyDataManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataManagerColumnPickerComponent implements OnDestroy, OnInit {
  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.displayedColumnData = this.searchColumns(
      this.columnData.filter((col) => !col.alwaysDisplayed)
    );

    if (value.onlyShowSelected) {
      this.displayedColumnData = this.displayedColumnData.filter(
        (col) => col.isSelected
      );
    }
  }

  public title = 'Choose columns to show in the list';
  public columnData: Column[];
  public displayedColumnData: Column[];
  public viewConfig: SkyDataViewConfig = {
    id: 'columnPicker',
    name: 'Column Picker',
    searchEnabled: true,
    searchExpandMode: 'fit',
    multiselectToolbarEnabled: true,
    onSelectAllClick: this.selectAll.bind(this),
    onClearAllClick: this.clearAll.bind(this),
  };

  private _dataState = new SkyDataManagerState({});
  private _ngUnsubscribe = new Subject();

  constructor(
    public context: SkyDataManagerColumnPickerContext,
    public dataManagerService: SkyDataManagerService,
    public instance: SkyModalInstance,
    private libResources: SkyLibResourcesService
  ) {}

  public ngOnInit(): void {
    this.libResources
      .getString('skyux_data_manager_column_picker_title')
      .subscribe((value) => {
        console.log(value);
      });
    this.dataManagerService.initDataManager({
      activeViewId: this.viewConfig.id,
      dataManagerConfig: {},
      defaultDataState: this.dataState,
    });
    this.dataManagerService.initDataView(this.viewConfig);

    this.columnData = this.formatColumnOptions();

    this.dataManagerService
      .getDataStateUpdates('columnPicker')
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((state) => {
        this.dataState = state;
      });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  public searchColumns(columns: Column[]): Column[] {
    let searchedColumns = columns;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedColumns = columns.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (
            item.hasOwnProperty(property) &&
            (property === 'label' || property === 'description')
          ) {
            const propertyText: string =
              item[property] && item[property].toUpperCase();
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
  }

  public clearAll(): void {
    this.displayedColumnData.forEach((column) => (column.isSelected = false));
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

  private formatColumnOptions(): Column[] {
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
