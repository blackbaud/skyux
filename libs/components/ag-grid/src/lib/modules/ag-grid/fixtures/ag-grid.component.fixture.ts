import {
  Component,
  InjectionToken,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  DomLayoutType,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';

import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

import { SKY_AG_GRID_DATA, SKY_AG_GRID_LOOKUP } from './ag-grid-data.fixture';
import { FirstInlineHelpComponent } from './inline-help.component';

export const EnableTopScroll = new InjectionToken<boolean>('EnableTopScroll', {
  providedIn: 'root',
  factory: (): boolean => false,
});
export const Editable = new InjectionToken<boolean>('Editable', {
  providedIn: 'root',
  factory: (): boolean => true,
});
export const DomLayout = new InjectionToken<DomLayoutType>('DomLayout', {
  providedIn: 'root',
  factory: (): DomLayoutType => 'autoHeight',
});
export const Loading = new InjectionToken<boolean>('Loading', {
  providedIn: 'root',
  factory: (): boolean => false,
});

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sky-ag-grid-component-fixture',
  templateUrl: './ag-grid.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
  imports: [SkyAgGridWrapperComponent, AgGridAngular],
})
export class SkyAgGridFixtureComponent implements OnInit {
  @ViewChild('agGrid', { static: true })
  public agGrid: AgGridAngular | undefined;

  @ViewChild(SkyAgGridWrapperComponent, { static: true })
  public agGridWrapper: SkyAgGridWrapperComponent | undefined;

  public enableTopScroll = inject(EnableTopScroll);
  public editable = inject(Editable);

  public gridData = SKY_AG_GRID_DATA;
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      maxWidth: 50,
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'First Name',
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
      minWidth: undefined,
      maxWidth: undefined,
      resizable: true,
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      editable: this.editable,
      type: SkyCellType.Text,
      minWidth: undefined,
      maxWidth: undefined,
      resizable: true,
    },
    {
      field: 'value',
      headerName: 'Current Value',
      editable: this.editable,
      type: SkyCellType.Number,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
      minWidth: undefined,
      maxWidth: undefined,
      resizable: true,
    },
    {
      field: 'target',
      headerName: 'Goal',
      type: SkyCellType.Number,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'date',
      headerName: 'Completed Date',
      editable: this.editable,
      type: SkyCellType.Date,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'currency',
      headerName: 'Currency amount',
      editable: this.editable,
      type: SkyCellType.Currency,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validNumber',
      headerName: 'Valid number',
      editable: this.editable,
      type: SkyCellType.NumberValidator,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validCurrency',
      headerName: 'Valid currency',
      editable: this.editable,
      type: SkyCellType.Currency,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validDate',
      headerName: 'Valid date',
      editable: this.editable,
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date): boolean => {
            const dt = new Date(1985, 10, 5, 12);
            return !!value && value > dt;
          },
          validatorMessage: 'Please enter a future date',
        },
      },
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      colId: 'lookupSingle',
      field: 'lookupSingle',
      minWidth: 185,
      maxWidth: 235,
      editable: this.editable,
      type: SkyCellType.Lookup,
      cellEditorParams: {
        skyComponentProperties: {
          data: SKY_AG_GRID_LOOKUP,
          idProperty: 'id',
          descriptorProperty: 'name',
          selectMode: 'single',
        },
      },
      cellRendererParams: {
        skyComponentProperties: {
          descriptorProperty: 'name',
        },
      },
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
        headerHidden: true,
      },
    },
    {
      colId: 'lookupMultiple',
      field: 'lookupMultiple',
      minWidth: 185,
      maxWidth: 235,
      editable: this.editable,
      type: SkyCellType.Lookup,
      cellEditorParams: {
        skyComponentProperties: {
          data: SKY_AG_GRID_LOOKUP,
          idProperty: 'id',
          descriptorProperty: 'name',
          selectMode: 'multiple',
          enableShowMore: true,
        },
      },
      cellRendererParams: {
        skyComponentProperties: {
          descriptorProperty: 'name',
        },
      },
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
  ];

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    domLayout: inject(DomLayout),
    suppressColumnVirtualisation: true,
    context: {
      enableTopScroll: this.enableTopScroll,
    },
    defaultColDef: {
      minWidth: undefined,
    },
    loading: inject(Loading),
  };

  #gridService = inject(SkyAgGridService);

  public ngOnInit(): void {
    if (this.editable) {
      this.gridOptions = this.#gridService.getEditableGridOptions({
        gridOptions: this.gridOptions,
      });
    } else {
      this.gridOptions = this.#gridService.getGridOptions({
        gridOptions: this.gridOptions,
      });
    }
  }
}
