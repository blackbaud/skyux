import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-viewkeeper-tabset',
  templateUrl: './viewkeeper-tabset.component.html',
  styleUrls: ['./viewkeeper-tabset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewkeeperTabsetComponent {
  public readonly gridOptions: GridOptions;
  public readonly columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      type: SkyCellType.Text,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
    },
  ];
  public readonly gridData = [
    { name: 'Billy Bob', age: 55 },
    { name: 'Jane Deere', age: 33 },
  ];

  public gridApi: GridApi | undefined;
  public showTabWithViewkeeper = false;

  constructor(private agGridService: SkyAgGridService) {
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        rowData: this.gridData,
        onGridReady: (event) => this.onGridReady(event),
      },
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
  }
}
