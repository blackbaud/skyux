import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

import { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

import { SKY_AG_GRID_DATA, SKY_AG_GRID_LOOKUP } from './ag-grid-data.fixture';
import { FirstInlineHelpComponent } from './inline-help.component';

export const EnableTopScroll = new InjectionToken('EnableTopScroll');

@Component({
  selector: 'sky-ag-grid-component-fixture',
  templateUrl: './ag-grid.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
})
export class SkyAgGridFixtureComponent implements OnInit {
  @ViewChild('agGrid', { static: true })
  public agGrid: AgGridAngular;

  public gridData = SKY_AG_GRID_DATA;
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'First Name',
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      editable: true,
      type: SkyCellType.Text,
    },
    {
      field: 'value',
      headerName: 'Current Value',
      editable: true,
      type: SkyCellType.Number,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
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
      editable: true,
      type: SkyCellType.Date,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'currency',
      headerName: 'Currency amount',
      editable: true,
      type: SkyCellType.Currency,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validNumber',
      headerName: 'Valid number',
      editable: true,
      type: SkyCellType.NumberValidator,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validCurrency',
      headerName: 'Valid currency',
      editable: true,
      type: SkyCellType.Currency,
      headerComponentParams: {
        inlineHelpComponent: FirstInlineHelpComponent,
      },
    },
    {
      field: 'validDate',
      headerName: 'Valid date',
      editable: true,
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date) => {
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
      editable: true,
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
      },
    },
    {
      colId: 'lookupMultiple',
      field: 'lookupMultiple',
      minWidth: 185,
      maxWidth: 235,
      editable: true,
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
    suppressColumnVirtualisation: true,
    context: {
      enableTopScroll: this.enableTopScroll,
    },
  };

  constructor(
    private gridService: SkyAgGridService,
    @Optional()
    @Inject(EnableTopScroll)
    public enableTopScroll: boolean | undefined
  ) {}

  public ngOnInit(): void {
    this.gridOptions = this.gridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
  }

  public asyncWait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
