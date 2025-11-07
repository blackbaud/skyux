import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridPreDestroyedEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { filter, fromEventPattern, switchMap } from 'rxjs';

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: boolean;
  myId?: string;
}

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-grid-test',
  templateUrl: './ag-grid-test.component.html',
  imports: [
    AgGridAngular,
    SkyAgGridModule,
    SkyPopoverModule,
    SkyDropdownModule,
  ],
})
export class AgGridTestComponent {
  readonly #gridService = inject(SkyAgGridService);
  readonly #dataForGrid: RowModel[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: true },
    { id: '2', column1: '01', column2: 'Banana', column3: false },
    { id: '3', column1: '11', column2: 'Banana', column3: true },
    { id: '4', column1: '12', column2: 'Daikon', column3: false },
    { id: '5', column1: '13', column2: 'Edamame', column3: true },
    { id: '6', column1: '20', column2: 'Fig', column3: false },
    { id: '7', column1: '21', column2: 'Grape', column3: true },
  ];

  public readonly showAllColumns = input(true);
  public readonly showCol3 = input(true);
  public readonly showCol3HeaderText = input(true);

  protected readonly gridApi = signal<GridApi | undefined>(undefined);
  protected readonly gridReady = signal(false);
  protected readonly gridOptions = computed(() =>
    this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs(),
        onGridReady: (args): void => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        rowData: this.#dataForGrid,
      } satisfies GridOptions<RowModel>,
    }),
  );

  readonly #columnDefs = computed<ColDef<RowModel>[]>(() => {
    const showAllColumns = this.showAllColumns();
    const showCol3 = this.showCol3();
    const showCol3HeaderText = this.showCol3HeaderText();

    if (!showAllColumns) {
      return [];
    }

    return [
      { field: 'id', type: 'string', hide: true },
      { field: 'column1', headerName: 'Column 1' },
      { field: 'column2', headerName: 'Column 2' },
      ...(showCol3
        ? [
            {
              field: 'column3',
              headerName: showCol3HeaderText ? 'Column 3' : '',
              cellDataType: 'boolean',
            },
          ]
        : []),
    ] as ColDef<RowModel>[];
  });
  readonly #gridDestroyed = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromEventPattern<GridPreDestroyedEvent>((handler) =>
        api.addEventListener('gridPreDestroyed', handler),
      ),
    ),
  );

  constructor() {
    this.#gridDestroyed.pipe(takeUntilDestroyed()).subscribe(() => {
      this.gridApi.set(undefined);
      this.gridReady.set(false);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const columns = this.#columnDefs();
      api?.setGridOption('columnDefs', columns);
    });
  }
}
