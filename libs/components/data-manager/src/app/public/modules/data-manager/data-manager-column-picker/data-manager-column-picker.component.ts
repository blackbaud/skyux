import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyDataManagerColumnPickerContext
} from './data-manager-column-picker-context';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  SkyDataManagerColumnPickerOption
} from '../models/data-manager-column-picker-option';

import {
  SkyDataManagerState
} from '../models/data-manager-state';

import {
  SkyDataViewConfig
} from '../models/data-view-config';

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
  providers: [SkyDataManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerColumnPickerComponent implements OnDestroy, OnInit {
  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.displayedColumnData = this.searchColumns(this.columnData.filter(col => !col.alwaysDisplayed));

    if (value.onlyShowSelected) {
      this.displayedColumnData = this.displayedColumnData.filter(col => col.isSelected);
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
    onClearAllClick: this.clearAll.bind(this)
  };

  private _dataState = new SkyDataManagerState({});
  private _ngUnsubscribe = new Subject();

  constructor(
    public context: SkyDataManagerColumnPickerContext,
    public dataManagerService: SkyDataManagerService,
    public instance: SkyModalInstance
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.viewConfig.id,
      dataManagerConfig: {},
      defaultDataState: this.dataState
    });
    this.dataManagerService.initDataView(this.viewConfig);

    this.columnData = this.formatColumnOptions();

    this.dataManagerService.getDataStateUpdates('columnPicker')
    .pipe(takeUntil(this._ngUnsubscribe))
    .subscribe(state => {
      this.dataState = state;
    });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  public searchColumns(columns: Column[]): Column[] {
    let searchedColumns = columns;
    let searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedColumns = columns.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'label' || property === 'description')) {
            const propertyText = item[property] && item[property].toLowerCase();
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
    this.displayedColumnData.forEach(column => column.isSelected = true);
  }

  public clearAll(): void {
    this.displayedColumnData.forEach(column => column.isSelected = false);
  }

  public cancelChanges(): void {
    this.instance.cancel();
  }

  public isSelected(id: string): boolean {
    return this.context.displayedColumnIds.findIndex(colId => colId === id) !== -1;
  }

  public applyChanges(): void {
    this.instance.save(this.columnData.filter(col => col.isSelected || col.alwaysDisplayed));
  }

  private formatColumnOptions(): Column[] {
    const allColumnOptions = this.context.columnOptions;
    const visibleColumnIds = this.context.displayedColumnIds;
    let formattedColumnOptions: Column[] = [];
    let unselectedColumnOptions: Column[] = [];

    for (let columnOption of allColumnOptions) {
      // format the column with the properties the column picker needs
      const colIndex = visibleColumnIds.indexOf(columnOption.id);
      let formattedColumn: Column = {
        alwaysDisplayed: columnOption.alwaysDisplayed,
        id: columnOption.id,
        label: columnOption.label,
        description: columnOption.description,
        isSelected: false
      };

      // if the column is currently displayed put it in that order in the column options,
      // else add it to the list of unselected columns to be alphebetized
      if (colIndex !== -1) {
        formattedColumn.isSelected = true;
        formattedColumnOptions[colIndex] = formattedColumn;
      } else {
        unselectedColumnOptions.push(formattedColumn);
      }
    }

    // sort the columns that are not currently displayed and add them after the currently displayed options
    unselectedColumnOptions.sort((col1, col2) => col1.label.localeCompare(col2.label));
    formattedColumnOptions = formattedColumnOptions.concat(unselectedColumnOptions);

    return formattedColumnOptions;
  }
}
