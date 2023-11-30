import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';

import { SkyGridService } from './grid.service';
import { SkyGridDefaultOptions } from './types/grid-options.type';

describe('SkyGridService', () => {
  let service: SkyGridService;
  let logServiceSpy: jasmine.SpyObj<SkyLogService>;

  beforeEach(() => {
    logServiceSpy = jasmine.createSpyObj('SkyLogService', ['warn', 'error']);
    TestBed.configureTestingModule({
      providers: [
        SkyGridService,
        {
          provide: SkyLogService,
          useValue: logServiceSpy,
        },
      ],
    });
    service = TestBed.inject(SkyGridService);
  });

  it('should retrieve options', () => {
    const options = service.readGridOptionsFromColumns(
      SkyGridDefaultOptions,
      [],
    );
    expect(options.domLayout).toEqual('normal');
  });

  it('should retrieve options with column array', () => {
    const gridOptions = service.readGridOptionsFromColumns(
      {
        ...SkyGridDefaultOptions,
        visibleRows: 'all',
      },
      [
        {
          field: 'test',
          type: 'text',
        },
      ],
    );
    expect(gridOptions.domLayout).toEqual('autoHeight');
  });

  it('should log missing columns', () => {
    service.readGridOptionsFromColumnComponents(
      SkyGridDefaultOptions,
      undefined,
    );
    expect(logServiceSpy.error).toHaveBeenCalledWith(
      `Unable to read grid options from columns.`,
    );
  });
});
