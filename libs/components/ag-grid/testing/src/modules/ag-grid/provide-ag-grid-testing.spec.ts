import { TestBed } from '@angular/core/testing';
import { SkyAgGridService } from '@skyux/ag-grid';

import { provideSkyAgGridTesting } from './provide-ag-grid-testing';

describe('provideSkyAgGridTestingOptions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyAgGridTesting()],
    });
  });

  it('should disable scroll-visibility recalculation and virtualization for read-only grids', () => {
    const gridOptions = TestBed.inject(SkyAgGridService).getGridOptions({
      gridOptions: {},
    });

    expect(gridOptions.alwaysShowHorizontalScroll).toBeTrue();
    expect(gridOptions.alwaysShowVerticalScroll).toBeTrue();
    expect(gridOptions.suppressColumnVirtualisation).toBeTrue();
    expect(gridOptions.suppressRowVirtualisation).toBeTrue();
  });

  it('should disable scroll-visibility recalculation and virtualization for editable grids', () => {
    const gridOptions = TestBed.inject(SkyAgGridService).getEditableGridOptions(
      {
        gridOptions: {},
      },
    );

    expect(gridOptions.alwaysShowHorizontalScroll).toBeTrue();
    expect(gridOptions.alwaysShowVerticalScroll).toBeTrue();
    expect(gridOptions.suppressColumnVirtualisation).toBeTrue();
    expect(gridOptions.suppressRowVirtualisation).toBeTrue();
  });
});
