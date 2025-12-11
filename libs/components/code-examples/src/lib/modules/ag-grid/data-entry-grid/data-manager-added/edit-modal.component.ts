import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  SkyAgGridAutocompleteProperties,
  SkyAgGridDatepickerProperties,
  SkyAgGridModule,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridApi,
  ICellEditorParams,
  IRowNode,
  ModuleRegistry,
} from 'ag-grid-community';

import { AgGridDemoRow, DEPARTMENTS, JOB_TITLES } from './data';
import { EditModalContext } from './edit-modal-context';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule, SkyModalModule],
})
export class EditModalComponent {
  readonly #gridApi = signal<GridApi | undefined>(undefined);

  protected readonly gridData = inject(EditModalContext).gridData;
  protected readonly gridOptions = inject(
    SkyAgGridService,
  ).getEditableGridOptions({
    gridOptions: {
      columnDefs: [
        {
          field: 'name',
          headerName: 'Name',
        },
        {
          field: 'age',
          headerName: 'Age',
          type: SkyCellType.Number,
          maxWidth: 60,
          editable: true,
        },
        {
          field: 'startDate',
          headerName: 'Start date',
          type: SkyCellType.Date,
          sort: 'asc',
        },
        {
          field: 'endDate',
          headerName: 'End date',
          type: SkyCellType.Date,
          editable: true,
          cellEditorParams: (
            params: ICellEditorParams<AgGridDemoRow>,
          ): { skyComponentProperties: SkyAgGridDatepickerProperties } => {
            return {
              skyComponentProperties: {
                minDate: params.data.startDate,
              },
            };
          },
        },
        {
          field: 'department',
          headerName: 'Department',
          type: SkyCellType.Autocomplete,
          editable: true,
          cellEditorParams: (
            params: ICellEditorParams<AgGridDemoRow>,
          ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
            return {
              skyComponentProperties: {
                data: DEPARTMENTS,
                selectionChange: (change): void => {
                  this.#departmentSelectionChange(change, params.node);
                },
              },
            };
          },
          onCellValueChanged: (event): void => {
            if (event.newValue !== event.oldValue) {
              this.#clearJobTitle(event.node);
            }
          },
        },
        {
          field: 'jobTitle',
          headerName: 'Title',
          type: SkyCellType.Autocomplete,
          editable: true,
          cellEditorParams: (
            params: ICellEditorParams<AgGridDemoRow>,
          ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
            const selectedDepartment = params.data?.department?.name;

            const editParams: {
              skyComponentProperties: SkyAgGridAutocompleteProperties;
            } = { skyComponentProperties: { data: [] } };

            if (selectedDepartment) {
              editParams.skyComponentProperties.data =
                JOB_TITLES[selectedDepartment];
            }

            return editParams;
          },
        },
        {
          colId: 'validationCurrency',
          field: 'validationCurrency',
          headerName: 'Validation currency',
          type: [SkyCellType.CurrencyValidator],
          editable: true,
        },
        {
          colId: 'validationDate',
          field: 'validationDate',
          headerName: 'Validation date',
          type: [SkyCellType.Date, SkyCellType.Validator],
          cellRendererParams: {
            skyComponentProperties: {
              validator: (value: Date): boolean =>
                !!value && value > new Date(1985, 9, 26),
              validatorMessage: 'Enter a future date.',
            },
          },
          editable: true,
        },
      ],
      onGridReady: (params) => {
        this.#gridApi.set(params.api);
      },
      onGridPreDestroyed: () => {
        this.#gridApi.set(undefined);
      },
      rowData: this.gridData,
    },
  });
  protected readonly instance = inject(SkyModalInstance);

  protected saveData(): void {
    this.instance.save(this.gridData);
  }

  #departmentSelectionChange(
    change: SkyAutocompleteSelectionChange,
    node: IRowNode<AgGridDemoRow>,
  ): void {
    if (change.selectedItem && change.selectedItem !== node.data?.department) {
      this.#clearJobTitle(node);
    }
  }

  #clearJobTitle(node: IRowNode<AgGridDemoRow> | null): void {
    if (node?.data) {
      node.data.jobTitle = undefined;
      this.#gridApi()?.applyTransaction({ update: [node.data] });
    }
  }
}
