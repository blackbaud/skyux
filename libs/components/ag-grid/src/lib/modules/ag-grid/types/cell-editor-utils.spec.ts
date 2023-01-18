import { SkyAgGridCellEditorUtils } from './cell-editor-utils';

describe('Cell editor utils', () => {
  describe('subtractIf()', () => {
    it('should return the difference if minuend is not null or undefined', () => {
      expect(SkyAgGridCellEditorUtils.subtractOrZero(2, 1)).toBe(1);
      expect(SkyAgGridCellEditorUtils.subtractOrZero(2, 3)).toBe(-1);
      expect(SkyAgGridCellEditorUtils.subtractOrZero(0, 0)).toBe(0);
    });

    it('should return 0 if minuend is null or undefined', () => {
      expect(SkyAgGridCellEditorUtils.subtractOrZero(null, 4)).toBe(0);
      expect(SkyAgGridCellEditorUtils.subtractOrZero(undefined, 8)).toBe(0);
    });
  });
});
