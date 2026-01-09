import { Component, TemplateRef, inject, viewChild } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { AG_GRID_DEMO_DATA } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @title Basic setup with template ref column type (without data manager)
 */
@Component({
  selector: 'app-ag-grid-data-grid-template-ref-column-example',
  templateUrl: './example.component.html',
  imports: [AgGridAngular, SkyAgGridModule],
})
export class AgGridDataGridTemplateRefColumnExampleComponent {
  protected readonly boldColumn = viewChild<TemplateRef<unknown>>('boldColumn');
  protected readonly emphasizedColumn =
    viewChild<TemplateRef<unknown>>('emphasizedColumn');
  protected gridOptions = inject(SkyAgGridService).getGridOptions({
    gridOptions: {
      columnDefs: [
        {
          field: 'name',
          headerName: 'Name',
          initialWidth: 150,
        },
        {
          field: 'age',
          headerName: 'Age',
          type: SkyCellType.Number,
          maxWidth: 80,
          resizable: false,
        },
        {
          field: 'department',
          headerName: 'Department',
          type: SkyCellType.Template,
          cellRendererParams: {
            template: this.boldColumn,
          },
          initialWidth: 220,
        },
        {
          field: 'jobTitle',
          headerName: 'Title',
          type: SkyCellType.Template,
          cellRendererParams: {
            template: this.emphasizedColumn,
          },
          initialWidth: 220,
        },
      ],
      rowData: AG_GRID_DEMO_DATA,
    },
  });
}
