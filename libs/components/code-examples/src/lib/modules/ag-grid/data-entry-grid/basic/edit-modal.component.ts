import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  SkyAgGridAutocompleteProperties,
  SkyAgGridDatepickerProperties,
  SkyAgGridModule,
  SkyAgGridService,
  SkyCellType,
  defineSkyAgGridColDef,
} from '@skyux/ag-grid';
import { SkyButton } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ICellEditorParams,
  ModuleRegistry,
  ValueSetterParams,
} from 'ag-grid-community';

import {
  AgGridDemoRow,
  AutocompleteOption,
  DEPARTMENTS,
  JOB_TITLES,
} from './data';
import { EditModalContext } from './edit-modal-context';
import { MarkInactiveComponent } from './mark-inactive.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AgGridAngular,
    SkyButton,
    SkyAgGridModule,
    SkyModalModule,
    MarkInactiveComponent,
  ],
})
export class EditModalComponent {
  protected readonly markInactiveAction =
    viewChild<TemplateRef<unknown>>('markInactiveAction');

  protected gridData = inject(EditModalContext).gridData;
  protected gridOptions = inject(
    SkyAgGridService,
  ).getEditableGridOptions<AgGridDemoRow>({
    gridOptions: {
      columnDefs: [
        defineSkyAgGridColDef({
          colId: 'markInactiveAction',
          headerName: 'Mark inactive',
          type: SkyCellType.Template,
          editable: true,
          cellRendererParams: {
            template: this.markInactiveAction,
          },
        }),
        defineSkyAgGridColDef({
          field: 'name',
          headerName: 'Name',
          type: SkyCellType.Text,
          cellRendererParams: {
            skyComponentProperties: {
              validator: (value: string): boolean => String(value).length <= 10,
              validatorMessage: `Value exceeds maximum length`,
            },
          },
          cellEditorParams: {
            skyComponentProperties: {
              maxlength: 10,
            },
          },
          editable: true,
        }),
        defineSkyAgGridColDef({
          field: 'age',
          headerName: 'Age',
          type: SkyCellType.Number,
          cellRendererParams: {
            skyComponentProperties: {
              validator: (value: number): boolean => value >= 18,
              validatorMessage: `Age must be 18+`,
            },
          },
          maxWidth: 60,
          cellEditorParams: {
            skyComponentProperties: {
              min: 18,
            },
          },
          editable: true,
        }),
        {
          field: 'startDate',
          headerName: 'Start date',
          type: SkyCellType.Date,
          sort: 'asc',
        },
        defineSkyAgGridColDef({
          field: 'endDate',
          headerName: 'End date',
          type: SkyCellType.Date,
          editable: true,
          cellEditorParams: (
            params: ICellEditorParams<AgGridDemoRow>,
          ): { skyComponentProperties: SkyAgGridDatepickerProperties } => {
            return {
              skyComponentProperties: { minDate: params.data.startDate },
            };
          },
        }),
        defineSkyAgGridColDef({
          field: 'department',
          headerName: 'Department',
          type: SkyCellType.Autocomplete,
          editable: true,
          cellEditorParams: {
            skyComponentProperties: {
              data: DEPARTMENTS,
            },
          },
          valueSetter: (
            params: ValueSetterParams<AgGridDemoRow, AutocompleteOption>,
          ): boolean => {
            if (params.newValue?.name === params.oldValue?.name) {
              return false;
            }

            params.data.department = params.newValue ?? undefined;
            // Job titles belong to a department, so clear the title when the
            // department changes. This must happen here rather than in
            // `onCellValueChanged`, because tabbing to the next cell starts
            // the job title editor before that event fires.
            params.data.jobTitle = undefined;
            params.api.refreshCells({ columns: ['jobTitle'] });

            return true;
          },
        }),
        defineSkyAgGridColDef({
          field: 'jobTitle',
          headerName: 'Title',
          type: SkyCellType.Autocomplete,
          editable: true,
          cellEditorParams: (
            params: ICellEditorParams<AgGridDemoRow>,
          ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
            const department = params.data.department?.name;

            return {
              skyComponentProperties: {
                data: department ? JOB_TITLES[department] : [],
              },
            };
          },
        }),
        {
          colId: 'validationCurrency',
          field: 'validationCurrency',
          headerName: 'Validation currency',
          type: [SkyCellType.CurrencyValidator],
          editable: true,
        },
        defineSkyAgGridColDef({
          colId: 'validationDate',
          field: 'validationDate',
          headerName: 'Validation date',
          type: [SkyCellType.Date, SkyCellType.Validator],
          cellRendererParams: {
            skyComponentProperties: {
              validator: (value: Date): boolean =>
                !!value && value > new Date(1985, 9, 26),
              validatorMessage: 'Please enter a future date',
            },
          },
          editable: true,
        }),
      ],
      stopEditingWhenCellsLoseFocus: true,
    },
  });

  protected readonly instance = inject(SkyModalInstance);
}
