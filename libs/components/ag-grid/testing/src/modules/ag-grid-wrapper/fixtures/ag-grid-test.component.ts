import { Component, inject, input } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';

import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: boolean;
  myId?: string;
}

@Component({
  selector: 'app-ag-grid-test',
  templateUrl: './ag-grid-test.component.html',
  imports: [SkyAgGridModule, AgGridAngular],
})
export class AgGridTestComponent {
  public data: RowModel[] | undefined = [
    { id: '1', column1: '1', column2: 'Apple', column3: true },
    { id: '2', column1: '01', column2: 'Banana', column3: false },
    { id: '3', column1: '11', column2: 'Banana', column3: true },
    { id: '4', column1: '12', column2: 'Daikon', column3: false },
    { id: '5', column1: '13', column2: 'Edamame', column3: true },
    { id: '6', column1: '20', column2: 'Fig', column3: false },
    { id: '7', column1: '21', column2: 'Grape', column3: true },
  ];

  protected readonly showAllGrids = input<boolean>(true);
  protected readonly gridOptions = inject(SkyAgGridService).getGridOptions({
    gridOptions: {
      columnDefs: [
        {
          field: 'column2',
          headerName: 'Name',
        },
        {
          field: 'column3',
          headerComponentParams: {
            headerHidden: true,
          },
        },
      ],
    },
  });
}
