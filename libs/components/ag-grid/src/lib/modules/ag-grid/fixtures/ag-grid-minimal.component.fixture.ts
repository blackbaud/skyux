import {
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  inject,
  input,
  viewChild,
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
        [gridOptions]="gridOptionsFromService()"
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

  public readonly gridOptions = input<GridOptions>({});

  protected readonly gridOptionsFromService = computed(() => {
    const defaultOptions = {
      alwaysShowHorizontalScroll: true,
      alwaysShowVerticalScroll: true,
      suppressColumnVirtualisation: true,
      suppressRowVirtualisation: true,
      columnDefs: this.columnDefs,
      domLayout: 'autoHeight' as DomLayoutType,
      context: {
        enableCellTextSelection: true,
      },
    };
    if (this.editable) {
      return this.#gridService.getEditableGridOptions({
        gridOptions: { ...defaultOptions, ...this.gridOptions() },
      });
    } else {
      return this.#gridService.getGridOptions({
        gridOptions: { ...defaultOptions, ...this.gridOptions() },
      });
    }
  });

  readonly #gridService = inject(SkyAgGridService);
}
