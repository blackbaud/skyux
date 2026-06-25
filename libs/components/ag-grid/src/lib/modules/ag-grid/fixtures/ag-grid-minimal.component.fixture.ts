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
        [gridOptions]="gridOptions"
        [rowData]="rowData"
      />
    </sky-ag-grid-wrapper>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SkyAgGridWrapperComponent, AgGridAngular],
})
export class SkyAgGridMinimalFixtureComponent implements OnInit {
  @ViewChild('minimalGrid', { static: true })
  public agGrid: AgGridAngular | undefined;

  public readonly columnDefs = inject(MinimalColumnDefs);
  public readonly rowData = inject(MinimalRowData);
  public readonly editable = inject(MinimalEditable);

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    domLayout: 'autoHeight',
    context: {
      enableCellTextSelection: true,
    },
  };

  readonly #gridService = inject(SkyAgGridService);

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
