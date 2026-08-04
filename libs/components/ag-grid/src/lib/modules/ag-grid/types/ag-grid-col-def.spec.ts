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
});
