import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';

import { lastValueFrom, of } from 'rxjs';

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
        enableMultiselect: true,
        visibleRows: 'all',
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
    expect(gridOptions.domLayout).toEqual('autoHeight');
  });

  it('should track column changes', async () => {
    const columns: any = [
      {
        field: 'test',
        type: 'text',
        changes: of([undefined]),
      },
      {
        type: 'text',
        alignment: 'center',
        locked: true,
        changes: of(),
      },
      {
        type: 'text',
        alignment: 'right',
        isSortable: true,
        changes: of(),
      },
    ];
    columns.changes = of([undefined, undefined]);
    const gridOptions = await lastValueFrom(
      service.readGridOptionsFromColumnComponents(
        {
          ...SkyGridDefaultOptions,
          enableMultiselect: true,
          visibleRows: 'all',
        },
        columns,
      ),
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
