import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';

import { AG_GRID_DEMO_DATA } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @title Basic setup with template ref column type (without data manager)
 */
@Component({
  selector: 'app-ag-grid-data-grid-template-ref-column-example',
  templateUrl: './example.component.html',
  imports: [AgGridModule, SkyAgGridModule],
})
export class AgGridDataGridTemplateRefColumnExampleComponent implements OnInit {
  @ViewChild('boldColumn', { static: true })
  protected boldColumn: TemplateRef<unknown> | undefined;

  @ViewChild('emphasizedColumn', { static: true })
  protected emphasizedColumn: TemplateRef<unknown> | undefined;

  protected gridData = AG_GRID_DEMO_DATA;
  protected gridOptions: GridOptions | undefined;

  readonly #agGridSvc = inject(SkyAgGridService);

  public ngOnInit(): void {
    this.gridOptions = this.#agGridSvc.getGridOptions({
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
      },
    });
  }
}
