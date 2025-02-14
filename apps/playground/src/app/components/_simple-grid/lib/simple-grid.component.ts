/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import { SkyResizeObserverService } from '@skyux/core';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { debounceTime } from 'rxjs';

import { SkySimpleGridColumnComponent } from './simple-grid-column.component';

type SkySimpleGridFit = 'scroll' | 'width';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
  selector: 'sky-simple-grid',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `<sky-ag-grid-wrapper>
      <ag-grid-angular
        skyBackToTop
        [gridOptions]="gridOptions()"
        [rowData]="rowData()"
      />
    </sky-ag-grid-wrapper>
    <ng-container>
      <ng-content select="sky-simple-grid-column" />
    </ng-container> `,
})
export class SkySimpleGridComponent {
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #resizeObserver = inject(SkyResizeObserverService);

  // Frequent:
  public data = input.required<unknown[]>();
  public enableMultiselect = input(false, { transform: booleanAttribute });
  public fit = input<SkySimpleGridFit>('width');

  // Infrequent:
  public selectedColumnIds = input();
  public selectedRowIds = input();
  public multiselectSelectionChange = output();
  public sortFieldChange = output();

  protected columnRefs = contentChildren(SkySimpleGridColumnComponent);

  #gridApi: GridApi | undefined;

  protected gridOptions = computed(() => {
    const columnDefs = this.columnDefs();
    const gridOptions: GridOptions = {
      columnDefs,
      onGridReady: ({ api }) => {
        this.#gridApi = api;
        api.sizeColumnsToFit();
        api.resetRowHeights();
      },
    };

    return this.#agGridSvc.getGridOptions({
      gridOptions,
    });
  });

  protected rowData = computed(() => {
    const data = this.data();
    return data;
  });

  protected columnDefs = computed(() => {
    const columnRefs = this.columnRefs();

    const defs: ColDef[] = [];

    for (const columnRef of columnRefs) {
      defs.push({
        colId: columnRef.id(),
        field: columnRef.field(),
        headerName: columnRef.heading(),
      });
    }

    return defs;
  });

  constructor() {
    this.#resizeObserver
      .observe(inject(ElementRef))
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe(() => {
        this.#gridApi.sizeColumnsToFit();
      });
  }
}
