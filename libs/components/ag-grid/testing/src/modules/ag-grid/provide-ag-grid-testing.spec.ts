import { Injector } from '@angular/core';
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

    it('should keep the flag active until the last of two independently-destroyed instances is torn down', () => {
      const win = window as unknown as { AG_GRID_UNDER_TEST?: boolean };
      const previous = win.AG_GRID_UNDER_TEST;
      // Force a fixed, non-false ambient value before the instances activate,
      // so the intermediate assertion below can only pass if the flag is
      // genuinely being kept active by injector B - not by coincidence
      // because the ambient value already happened to be non-false.
      win.AG_GRID_UNDER_TEST = true;

      TestBed.configureTestingModule({});
      const parent = TestBed.inject(Injector);
      const injectorA = Injector.create({
        providers: [provideSkyAgGridTesting()],
        parent,
      });
      const injectorB = Injector.create({
        providers: [provideSkyAgGridTesting()],
        parent,
      });
      let injectorADestroyed = false;
      let injectorBDestroyed = false;

      try {
        injectorA.get(SkyAgGridService); // instantiates the testing service
        injectorB.get(SkyAgGridService); // instantiates a second, independent instance
        expect(win.AG_GRID_UNDER_TEST).toBeFalse();

        injectorA.destroy();
        injectorADestroyed = true;
        expect(win.AG_GRID_UNDER_TEST).toBeFalse(); // injector B is still alive

        injectorB.destroy();
        injectorBDestroyed = true;
        expect(win.AG_GRID_UNDER_TEST).toBeTrue(); // restored to the forced sentinel
      } finally {
        if (!injectorADestroyed) {
          injectorA.destroy();
        }
        if (!injectorBDestroyed) {
          injectorB.destroy();
        }
        if (previous === undefined) {
          delete win.AG_GRID_UNDER_TEST;
        } else {
          win.AG_GRID_UNDER_TEST = previous;
        }
      }
    });
  });
});
