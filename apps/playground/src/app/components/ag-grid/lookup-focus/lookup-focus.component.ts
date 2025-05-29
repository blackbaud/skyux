//#region Imports
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyAutocompleteSearchAsyncArgs } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { AG_GRID_DEMO_DATA, DEPARTMENTS } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);
//#endregion

@Component({
  selector: 'app-lookup-focus',
  templateUrl: './lookup-focus.component.html',
  imports: [AgGridModule, SkyAgGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupFocusComponent {
  protected readonly gridOptionsV1: GridOptions;
  protected readonly gridOptionsV2: GridOptions;

  readonly #agGridSvc = inject(SkyAgGridService);

  constructor() {
    const gridOptions: GridOptions = {
      rowData: AG_GRID_DEMO_DATA,
      columnDefs: this.#getColumnDefs(),
      autoSizeStrategy: {
        type: 'fitGridWidth',
      },
    };

    this.gridOptionsV1 = this.#agGridSvc.getEditableGridOptions({
      gridOptions: {
        ...gridOptions,
        stopEditingWhenCellsLoseFocus: false,
      },
    });
    this.gridOptionsV2 = this.#agGridSvc.getEditableGridOptions({
      gridOptions: {
        ...gridOptions,
        stopEditingWhenCellsLoseFocus: true,
      },
    });
  }

  #getColumnDefs(): ColDef[] {
    return [
      {
        field: 'name',
        headerName: 'Name',
        type: SkyCellType.Text,
        editable: false,
        maxWidth: 200,
      },
      {
        field: 'age',
        headerName: 'Age',
        type: SkyCellType.Number,
        maxWidth: 60,
        editable: false,
      },
      {
        field: 'department',
        headerName: 'Department',
        type: SkyCellType.Lookup,
        editable: true,
        cellEditorParams: () => ({
          skyComponentProperties: {
            idProperty: 'id',
            descriptorProperty: 'name',
            propertiesToSearch: ['name'],
            selectMode: 'single',
            enableShowMore: true,
            searchAsync: ($event: SkyAutocompleteSearchAsyncArgs): void => {
              const allItems = DEPARTMENTS;
              const filtered = allItems.filter((items) =>
                items.name
                  .toLowerCase()
                  .includes($event.searchText.toLowerCase()),
              );

              $event.result = of({
                items: filtered,
                totalCount: allItems.length,
                hasMore: false,
              });
            },
          },
        }),
      },
    ];
  }
}
