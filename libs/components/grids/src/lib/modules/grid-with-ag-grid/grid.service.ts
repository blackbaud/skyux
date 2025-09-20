import { Injectable, inject } from '@angular/core';
import {
  SkyAgGridService,
  SkyCellClass,
  SkyCellType,
  SkyHeaderClass,
  SkyRowClass,
} from '@skyux/ag-grid';
import { ListItemModel } from '@skyux/list-builder-common';

import {
  ColDef,
  ColDefField,
  GetRowIdParams,
  GridOptions,
  RowClassParams,
} from 'ag-grid-community';

import {
  SkyGridColumnModelInterface,
  SkyGridColumnType,
} from './grid-column.model';
import { SkyGridInlineHelpComponent } from './grid-inline-help/grid-inline-help.component';
import { SkyGridColumnAlignment } from './types/grid-column-alignment';
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

let uniqueId = -1;
const selectorField = '_selector' as const;

@Injectable({
  providedIn: 'root',
})
export class SkyGridService {
  #agGridService = inject(SkyAgGridService);

  public readGridOptionsFromColumns<TData>(
    options: Partial<SkyGridOptions>,
    columns: Iterable<SkyGridColumnModelInterface>,
    rowData: TData[] | ListItemModel[] = [],
  ): GridOptions<TData> {
    options = Object.assign({}, SkyGridDefaultOptions, options);

    const columnDefs = this.getAgGridColDefs(
      options as SkyGridOptions,
      columns,
    );
    const gridOptions: GridOptions<TData> = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll: options.showTopScroll,
        },
        domLayout: options.visibleRows === 'all' ? 'autoHeight' : 'normal',
        pagination: options.pageSize > 0,
        suppressPaginationPanel: true,
        paginationPageSize: options.pageSize,
        suppressRowClickSelection: !options.enableMultiselect,
        rowData: this.#processData(rowData),
        getRowClass: this.getRowClassFn(options),
        isExternalFilterPresent: () => {
          return (
            !!options.getDataManagerState &&
            !!(options.getDataManagerState().searchText || '').trim()
          );
        },
        doesExternalFilterPass: (node) => {
          const searchText = `${
            options.getDataManagerState &&
            options.getDataManagerState().searchText
          }`.trim();
          if (!searchText) {
            return true;
          }
          return columnDefs.some((colDef) => {
            if (!colDef.hide) {
              const value = node.data[colDef.field];
              if (value) {
                if (colDef.filterParams.searchFunction) {
                  return colDef.filterParams.searchFunction(value, searchText);
                } else {
                  return value
                    .toString()
                    .toLocaleLowerCase()
                    .includes(searchText?.toLocaleLowerCase());
                }
              }
            }
            return false;
          });
        },
      } as GridOptions,
    });

    if (options.multiselectRowId) {
      gridOptions.getRowId = (params: GetRowIdParams): string =>
        `${params.data[options.multiselectRowId] || uniqueId--}`;
    }

    gridOptions.components = {
      ...gridOptions.components,
      SkyGridInlineHelpComponent: SkyGridInlineHelpComponent,
    };
    return gridOptions;
  }

  public getAgGridColDefs<TData extends { [selectorField]?: boolean }>(
    options: SkyGridOptions,
    columns: Iterable<SkyGridColumnModelInterface>,
  ): ColDefWithField<TData>[] {
    const columnDefs = Array.from(columns).map((column, index) => {
      return {
        cellRendererParams: {
          template: column.template,
        },
        cellClass: this.#getCellClass(column.alignment),
        field: column.field || `column${`${index + 1}`.padStart(3, '0')}`,
        headerComponentParams: {
          description: column.description,
          inlineHelpComponent: SkyGridInlineHelpComponent,
          inlineHelpPopover: column.inlineHelpPopover,
          inlineHelpPopoverModelChanges: column.inlineHelpPopoverModelChanges,
        },
        headerName: column.heading || ' ',
        headerClass: this.#getHeaderClass(column.alignment),
        hide: column.hidden,
        lockVisible: column.locked,
        resizable: column.locked ? false : undefined,
        sortable: column.isSortable && options.sortEnabled,
        suppressMovable: column.locked,
        type: columnTypeMapping[column.template ? 'template' : column.type],
        width: column.width,
        minWidth: column.width,
        filterParams: {
          searchFunction: column.search,
        },
      } as ColDefWithField<TData>;
    });
    if (options.enableMultiselect) {
      columnDefs.unshift({
        type: columnTypeMapping.selector,
        field: selectorField as ColDefField<TData>,
        lockVisible: true,
      });
    }
    return columnDefs;
  }

  public getRowClassFn = (
    options: Partial<SkyGridOptions>,
  ): ((params: RowClassParams) => string | string[]) => {
    return (params: RowClassParams) =>
      params.node.id === options.rowHighlightId ? SkyRowClass.Highlight : '';
  };

  #getHeaderClass(alignment: SkyGridColumnAlignment): string[] {
    const classes: string[] = [];

    if (alignment === 'right') {
      classes.push(SkyHeaderClass.RightAligned);
    } else if (alignment === 'center') {
      classes.push(SkyHeaderClass.CenterAligned);
    }

    return classes;
  }

  #getCellClass(alignment: SkyGridColumnAlignment): string[] {
    const classes: string[] = [];

    if (alignment === 'right') {
      classes.push(SkyCellClass.RightAligned);
    } else if (alignment === 'center') {
      classes.push(SkyCellClass.CenterAligned);
    }

    return classes;
  }

  #processData<TData>(rowData: TData[] | ListItemModel[]): TData[] {
    if (rowData[0] && rowData[0] instanceof ListItemModel) {
      return rowData.map((item) => item.data) as TData[];
    } else {
      return rowData as TData[];
    }
  }
}
