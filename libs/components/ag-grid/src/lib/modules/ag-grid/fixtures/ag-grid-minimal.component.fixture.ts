import {
  Component,
  InjectionToken,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  DomLayoutType,
  ModuleRegistry,
} from 'ag-grid-community';

import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';

import { AG_GRID_FIXTURE_TEST_OPTIONS } from './ag-grid-fixture-test-options';

ModuleRegistry.registerModules([AllCommunityModule]);

export const MinimalColumnDefs = new InjectionToken<ColDef[]>(
  'MinimalColumnDefs',
);
export const MinimalRowData = new InjectionToken<Record<string, unknown>[]>(
  'MinimalRowData',
);
export const MinimalEditable = new InjectionToken<boolean>('MinimalEditable', {
  providedIn: 'root',
  factory: (): boolean => true,
});

@Component({
  selector: 'sky-ag-grid-minimal-fixture',
  template: `
    <sky-ag-grid-wrapper>
      <ag-grid-angular
        #minimalGrid
        [class.sky-ag-grid-editable]="editable"
        [gridOptions]="gridOptionsFromService"
        [rowData]="rowData"
      />
    </sky-ag-grid-wrapper>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SkyAgGridWrapperComponent, AgGridAngular],
})
export class SkyAgGridMinimalFixtureComponent {
  public readonly agGrid = viewChild<AgGridAngular>('minimalGrid');

  public readonly columnDefs = inject(MinimalColumnDefs);
  public readonly rowData = inject(MinimalRowData);
  public readonly editable = inject(MinimalEditable);

  readonly #gridService = inject(SkyAgGridService);

  protected readonly gridOptionsFromService = this.editable
    ? this.#gridService.getEditableGridOptions({
        gridOptions: {
          ...AG_GRID_FIXTURE_TEST_OPTIONS,
          columnDefs: this.columnDefs,
          domLayout: 'autoHeight' as DomLayoutType,
          context: {
            enableCellTextSelection: true,
          },
        },
      })
    : this.#gridService.getGridOptions({
        gridOptions: {
          ...AG_GRID_FIXTURE_TEST_OPTIONS,
          columnDefs: this.columnDefs,
          domLayout: 'autoHeight' as DomLayoutType,
          context: {
            enableCellTextSelection: true,
          },
        },
      });
}
