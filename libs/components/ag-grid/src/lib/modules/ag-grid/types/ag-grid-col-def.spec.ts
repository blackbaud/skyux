import { SkyCellType } from './cell-type';

import { defineSkyAgGridColDef } from './ag-grid-col-def';

describe('defineSkyAgGridColDef', () => {
  it('should return the column definition unchanged', () => {
    const colDef = {
      field: 'name',
      type: SkyCellType.Text,
    };

    expect(defineSkyAgGridColDef(colDef)).toBe(colDef);
  });

  it('should validate params against the cell type', () => {
    const validatorColDef = defineSkyAgGridColDef({
      field: 'endDate',
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date): boolean => !!value,
          validatorMessage: 'Enter a valid date',
        },
      },
    });

    const autocompleteColDef = defineSkyAgGridColDef({
      field: 'department',
      type: SkyCellType.Autocomplete,
      cellEditorParams: {
        skyComponentProperties: { data: [] },
      },
    });

    expect(validatorColDef.type).toEqual([
      SkyCellType.Date,
      SkyCellType.Validator,
    ]);
    expect(autocompleteColDef.type).toBe(SkyCellType.Autocomplete);

    defineSkyAgGridColDef({
      field: 'name',
      type: SkyCellType.Text,
      // @ts-expect-error - misspelled properties are rejected
      cellRenderrerParams: {},
    });

    defineSkyAgGridColDef({
      field: 'endDate',
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          // @ts-expect-error - validatorMessage must be a string
          validatorMessage: 123,
        },
      },
    });

    defineSkyAgGridColDef({
      field: 'template',
      type: SkyCellType.Template,
      // @ts-expect-error - Template cells require a template param
      cellRendererParams: {},
    });

    defineSkyAgGridColDef({
      field: 'template',
      type: SkyCellType.Template,
      // @ts-expect-error - Template cells accept no editor params
      cellEditorParams: {},
    });

    defineSkyAgGridColDef({
      field: 'department',
      type: SkyCellType.Autocomplete,
      // @ts-expect-error - Autocomplete cells accept no renderer params
      cellRendererParams: {},
    });

    defineSkyAgGridColDef({
      field: 'name',
      type: SkyCellType.RightAligned,
      // @ts-expect-error - RightAligned cells accept no editor params
      cellEditorParams: {},
    });

    defineSkyAgGridColDef({
      field: 'name',
      type: SkyCellType.RightAligned,
      // @ts-expect-error - RightAligned cells accept no renderer params
      cellRendererParams: {},
    });

    defineSkyAgGridColDef({
      field: 'selected',
      type: SkyCellType.RowSelector,
      // @ts-expect-error - RowSelector cells accept no editor params
      cellEditorParams: {},
    });
  });
});
