import { SkyDataViewColumnWidths } from './data-view-column-widths';
import { SkyDataViewState } from './data-view-state';

describe('SkyDataViewState', () => {
  describe('constructor', () => {
    it('should default xs and sm to empty objects when columnWidths sub-properties are undefined', () => {
      const state = new SkyDataViewState({
        viewId: 'test',
        columnWidths: {
          xs: undefined,
          sm: undefined,
        } as unknown as SkyDataViewColumnWidths,
      });

      expect(state.columnWidths).toEqual({ xs: {}, sm: {} });
    });
  });

  describe('getViewStateOptions', () => {
    it('should default xs and sm to empty objects when columnWidths sub-properties are undefined', () => {
      const state = new SkyDataViewState({ viewId: 'test' });
      state.columnWidths = {
        xs: undefined,
        sm: undefined,
      } as unknown as SkyDataViewColumnWidths;

      const options = state.getViewStateOptions();

      expect(options.columnWidths).toEqual({ xs: {}, sm: {} });
    });
  });
});
