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
    expect(options.domLayout).toEqual('autoHeight');
  });

  it('should retrieve options with column array', () => {
    const gridOptions = service.readGridOptionsFromColumns(
      {
        ...SkyGridDefaultOptions,
        enableMultiselect: true,
        visibleRows: 10,
      },
      [
        {
          field: 'test',
          type: 'text',
        },
        {
          type: 'text',
          alignment: 'center',
          locked: true,
        },
        {
          type: 'text',
          alignment: 'right',
          isSortable: true,
        },
      ],
    );
    expect(gridOptions.domLayout).toEqual('normal');
  });
});
