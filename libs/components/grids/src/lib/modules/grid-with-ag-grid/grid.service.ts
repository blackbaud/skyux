import { DestroyRef, Injectable, QueryList, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyLogService } from '@skyux/core';

import { ColDef, GridOptions } from 'ag-grid-community';
import { Observable, map, merge, of, switchMap, takeUntil } from 'rxjs';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridColumnModel, SkyGridColumnType } from './grid-column.model';
import { SkyGridInlineHelpComponent } from './grid-inline-help/grid-inline-help.component';
import {
  SkyGridDefaultOptions,
  SkyGridOptions,
} from './types/grid-options.type';

const columnTypeMapping: Record<SkyGridColumnType, SkyCellType[]> = {
  autocomplete: [SkyCellType.Autocomplete],
  currency: [SkyCellType.Currency],
  date: [SkyCellType.Date],
  lookup: [SkyCellType.Lookup],
  number: [SkyCellType.Number],
  selector: [SkyCellType.RowSelector],
  template: [SkyCellType.Template],
  text: [SkyCellType.Text],
};

export type ColDefWithField<TData> = ColDef<TData> & { field: string };

@Injectable({
  providedIn: 'root',
})
export class SkyGridService {
  #destroyRef = inject(DestroyRef);
  #agGridService = inject(SkyAgGridService);
  #logService = inject(SkyLogService);

  public readGridOptionsFromColumns<TData>(
    options: Partial<SkyGridOptions>,
    columns: Iterable<SkyGridColumnModel>,
  ): GridOptions<TData> {
    options = Object.assign({}, SkyGridDefaultOptions, options);
    const gridOptions: GridOptions<TData> = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.#getAgGridColDefs(options as SkyGridOptions, columns),
        context: {
          enableTopScroll: options.enableTopScroll,
        },
        domLayout: options.visibleRows === 'all' ? 'autoHeight' : 'normal',
        pagination: (options.totalRows || 0) > options.pageSize,
        suppressPaginationPanel: true,
        paginationPageSize: options.pageSize,
      } as GridOptions,
    });
    gridOptions.components = {
      ...gridOptions.components,
      SkyGridInlineHelpComponent: SkyGridInlineHelpComponent,
    };
    return gridOptions;
  }

  public readGridOptionsFromColumnComponents<TData>(
    options: SkyGridOptions,
    columnComponents: QueryList<SkyGridColumnComponent> | undefined,
  ): Observable<GridOptions<TData>> {
    if (!columnComponents) {
      this.#logService.error(`Unable to read grid options from columns.`);
      return of({});
    }
    options = Object.assign({}, SkyGridDefaultOptions, options);
    return merge(
      of(columnComponents),
      merge(
        columnComponents.changes,
        columnComponents.changes.pipe(
          switchMap(() =>
            merge(...columnComponents.map((column) => column.changes)).pipe(
              takeUntil(columnComponents.changes),
            ),
          ),
        ),
      ),
    ).pipe(
      takeUntilDestroyed(this.#destroyRef),
      map(() => this.readGridOptionsFromColumns(options, columnComponents)),
    );
  }

  #getAgGridColDefs<TData>(
    options: SkyGridOptions,
    columns: Iterable<SkyGridColumnModel>,
  ): ColDefWithField<TData>[] {
    return Array.from(columns).map((column, index) => {
      let cellRenderer: string | undefined = undefined;
      if (column.type === 'template') {
        cellRenderer = 'EasyGridCellComponent';
      }
      const hasInlineHelp = !!(column.description || column.inlineHelpPopover);
      return {
        cellRenderer,
        cellRendererParams: {
          template: column.template,
        },
        field: column.field || `column${`${index + 1}`.padStart(3, '0')}`,
        headerComponentParams: {
          description: column.description,
          inlineHelpComponent: hasInlineHelp
            ? SkyGridInlineHelpComponent
            : undefined,
          inlineHelpPopover: column.inlineHelpPopover,
        },
        headerName: column.heading,
        hide: column.hidden,
        resizable: column.locked ? false : undefined,
        sortable: column.isSortable && options.sortEnabled,
        suppressMovable: column.locked,
        type: columnTypeMapping[column.type],
        width: column.width,
      } as ColDefWithField<TData>;
    });
  }
}
