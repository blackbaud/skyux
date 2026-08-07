import { TestBed } from '@angular/core/testing';
import { SkyAgGridService } from '@skyux/ag-grid';

import { provideSkyDataGridTesting } from './provide-data-grid-testing';

describe('provideSkyDataGridTesting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyDataGridTesting()],
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
    const gridOptions = TestBed.inject(SkyAgGridService).getEditableGridOptions(
      {
        gridOptions: {},
      },
    );

    expect(gridOptions.suppressColumnVirtualisation).toBeTrue();
    expect(gridOptions.suppressRowVirtualisation).toBeTrue();
  });
});
