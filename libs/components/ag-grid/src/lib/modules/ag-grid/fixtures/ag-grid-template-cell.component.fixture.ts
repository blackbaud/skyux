import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';

import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * A minimal fixture exposing a single editable `SkyCellType.Template` column,
 * for testing wrapper behavior that reacts to template-cell editing (e.g.
 * focus handling), which no other fixture covers.
 */
@Component({
  selector: 'sky-ag-grid-template-cell-fixture',
  templateUrl: './ag-grid-template-cell.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
  imports: [SkyAgGridWrapperComponent, AgGridAngular],
})
export class SkyAgGridTemplateCellFixtureComponent {
  public readonly agGrid = viewChild<AgGridAngular>('agGrid');

  protected readonly actionTemplate =
    viewChild<TemplateRef<unknown>>('actionTemplate');

  public gridData = [{ id: 1, name: 'Row 1' }];

  public columnDefs: ColDef[] = [
    {
      colId: 'action',
      headerName: 'Action',
      type: SkyCellType.Template,
      editable: true,
      cellRendererParams: {
        template: this.actionTemplate,
      },
    },
    {
      field: 'name',
      headerName: 'Name',
    },
  ];

  public gridOptions: GridOptions = inject(
    SkyAgGridService,
  ).getEditableGridOptions({
    gridOptions: {
      columnDefs: this.columnDefs,
      domLayout: 'autoHeight',
      alwaysShowHorizontalScroll: true,
      alwaysShowVerticalScroll: true,
      suppressColumnVirtualisation: true,
      suppressRowVirtualisation: true,
    },
  });
}
