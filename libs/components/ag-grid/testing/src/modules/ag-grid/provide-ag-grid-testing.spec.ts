import { TestBed } from '@angular/core/testing';
import { SkyAgGridService } from '@skyux/ag-grid';

import { provideSkyAgGridTesting } from './provide-ag-grid-testing';

describe('provideSkyAgGridTesting', () => {
  describe('grid options', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSkyAgGridTesting()],
      });
    });

    it('should disable virtualization for read-only grids', () => {
      const gridOptions = TestBed.inject(SkyAgGridService).getGridOptions({
        gridOptions: {},
      });

      expect(gridOptions.suppressColumnVirtualisation).toBeTrue();
      expect(gridOptions.suppressRowVirtualisation).toBeTrue();
    });

    it('should disable virtualization for editable grids', () => {
      const gridOptions = TestBed.inject(
        SkyAgGridService,
      ).getEditableGridOptions({
        gridOptions: {},
      });

      expect(gridOptions.suppressColumnVirtualisation).toBeTrue();
      expect(gridOptions.suppressRowVirtualisation).toBeTrue();
    });
  });

  describe('AG_GRID_UNDER_TEST flag', () => {
    it('should set AG_GRID_UNDER_TEST to false while active and restore it after teardown', () => {
      const win = window as unknown as { AG_GRID_UNDER_TEST?: boolean };
      const previous = win.AG_GRID_UNDER_TEST;

      TestBed.configureTestingModule({
        providers: [provideSkyAgGridTesting()],
      });
      TestBed.inject(SkyAgGridService); // instantiates the testing service
      expect(win.AG_GRID_UNDER_TEST).toBeFalse();

      TestBed.resetTestingModule(); // destroys the injector
      expect(win.AG_GRID_UNDER_TEST).toBe(previous); // undefined restored as undefined
    });

    it('should restore a pre-existing AG_GRID_UNDER_TEST value', () => {
      const win = window as unknown as { AG_GRID_UNDER_TEST?: boolean };
      win.AG_GRID_UNDER_TEST = true;
      try {
        TestBed.configureTestingModule({
          providers: [provideSkyAgGridTesting()],
        });
        TestBed.inject(SkyAgGridService);
        expect(win.AG_GRID_UNDER_TEST).toBeFalse();
        TestBed.resetTestingModule();
        expect(win.AG_GRID_UNDER_TEST).toBeTrue();
      } finally {
        delete win.AG_GRID_UNDER_TEST;
      }
    });
  });
});
