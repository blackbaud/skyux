import { SkyCellType } from './cell-type';

import { skyAgGridColDef } from './ag-grid-col-def';

describe('skyAgGridColDef', () => {
  it('should return the column definition unchanged', () => {
    const colDef = {
      field: 'name',
      type: SkyCellType.Text,
    };

    expect(skyAgGridColDef(colDef)).toBe(colDef);
  });
});
