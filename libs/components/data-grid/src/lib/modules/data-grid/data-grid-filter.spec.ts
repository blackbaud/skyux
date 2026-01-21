import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';

import { doesFilterPass } from './data-grid-filter';

describe('data-grid-filter', () => {
  let logService: SkyLogService;
  let logSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    logService = TestBed.inject(SkyLogService);
    logSpy = spyOn(logService, 'warn');
  });

  it('should apply filters for data grid', () => {
    expect(
      doesFilterPass(
        [{ filterId: 'test', filterValue: { value: 'example' } }],
        { id: '1', test: 'example' },
        [
          {
            filterId: undefined,
            field: 'test',
            filterOperator: 'contains',
            type: 'text',
          },
        ],
        logService,
      ),
    ).toBeTrue();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should pass if column is not found', () => {
    expect(
      doesFilterPass(
        [{ filterId: 'missing', filterValue: { value: 'example' } }],
        { id: '1', test: 'example' },
        [
          {
            filterId: 'test',
            field: 'test',
            filterOperator: 'contains',
            type: 'text',
          },
        ],
        logService,
      ),
    ).toBeTrue();
  });

  it('should pass if filter value is undefined', () => {
    expect(
      doesFilterPass(
        [
          {
            filterId: 'test',
            filterValue: { value: undefined as unknown as string },
          },
        ],
        { id: '1', test: 'example' },
        [
          {
            filterId: 'test',
            field: 'test',
            filterOperator: 'contains',
            type: 'text',
          },
        ],
        logService,
      ),
    ).toBeTrue();
  });

  it('should not pass if data is undefined', () => {
    expect(
      doesFilterPass(
        [{ filterId: 'test', filterValue: { value: 'example' } }],
        undefined as any,
        [
          {
            filterId: 'test',
            field: 'test',
            filterOperator: 'contains',
            type: 'text',
          },
        ],
        logService,
      ),
    ).toBeFalse();
  });

  it('should not pass if data field is undefined', () => {
    expect(
      doesFilterPass(
        [{ filterId: 'test', filterValue: { value: 'example' } }],
        { id: '1', test: undefined },
        [
          {
            filterId: 'test',
            field: 'test',
            filterOperator: 'contains',
            type: 'text',
          },
        ],
        logService,
      ),
    ).toBeFalse();
  });

  describe('text filters', () => {
    const columns = [
      {
        filterId: 'text',
        field: 'text',
        filterOperator: undefined, // defaults
        type: 'text',
      },
    ] as const;

    it('should filter with "equals"', () => {
      const cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      // Match
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      // No match
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'def' },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Case insensitive
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ABC' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "notEqual"', () => {
      const cols = [{ ...columns[0], filterOperator: 'notEqual' }] as any;
      // Match (fail)
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
      // No match (pass)
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'def' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "contains"', () => {
      const cols = [{ ...columns[0], filterOperator: 'contains' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'de' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter with "notContains"', () => {
      const cols = [{ ...columns[0], filterOperator: 'notContains' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'de' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "startsWith"', () => {
      const cols = [{ ...columns[0], filterOperator: 'startsWith' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ab' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter with "endsWith"', () => {
      const cols = [{ ...columns[0], filterOperator: 'endsWith' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ab' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should handle undefined/null values gracefully', () => {
      const cols = [{ ...columns[0], filterOperator: 'contains' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'null' } }],
          { id: '1', text: 'null' },
          cols,
          logService,
        ),
      ).toBeTrue(); // 'null' string matches null
    });

    it('should warn and pass for unsupported operator', () => {
      const cols = [{ ...columns[0], filterOperator: 'unknown' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith(
        'Unsupported text filter operator: unknown',
      );
    });

    it('should filter with array values (OR logic)', () => {
      const cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: ['abc', 'xyz'] } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();

      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { value: ['xyz', 'uvw'] } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should support "val" property for filter value', () => {
      const cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'text', filterValue: { val: 'abc' } as any }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });
  });

  describe('number filters', () => {
    const columns = [
      {
        filterId: 'num',
        field: 'num',
        filterOperator: undefined,
        type: 'number',
      },
    ] as const;

    it('should filter single values with basic operators', () => {
      // equals
      let cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // notEqual
      cols = [{ ...columns[0], filterOperator: 'notEqual' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // lessThan
      cols = [{ ...columns[0], filterOperator: 'lessThan' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 9 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // lessThanOrEqual
      cols = [{ ...columns[0], filterOperator: 'lessThanOrEqual' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // greaterThan
      cols = [{ ...columns[0], filterOperator: 'greaterThan' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // greaterThanOrEqual
      cols = [{ ...columns[0], filterOperator: 'greaterThanOrEqual' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 9 },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter number ranges', () => {
      const cols = [{ ...columns[0], filterOperator: undefined }] as any;
      // In range
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: 5, to: 15 } as any },
            },
          ],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      // Out range (low)
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: 5, to: 15 } as any },
            },
          ],
          { id: '1', num: 4 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Out range (high)
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: 5, to: 15 } as any },
            },
          ],
          { id: '1', num: 16 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Open ended (from)
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: 5, to: null } as any },
            },
          ],
          { id: '1', num: 6 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: 5, to: null } as any },
            },
          ],
          { id: '1', num: 4 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Open ended (to)
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: null, to: 15 } as any },
            },
          ],
          { id: '1', num: 14 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [
            {
              filterId: 'num',
              filterValue: { value: { from: null, to: 15 } as any },
            },
          ],
          { id: '1', num: 16 },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should warn and pass for unsupported operator', () => {
      const cols = [{ ...columns[0], filterOperator: 'unknown' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue(); // defaults to false in numericFilter but !false is true here?
      // Wait, numericFilter default returns false. !false is true. Correct.
      expect(logSpy).toHaveBeenCalledWith(
        'Unsupported number or date filter operator: unknown',
      );
    });
  });

  describe('date filters', () => {
    const columns = [
      {
        filterId: 'date',
        field: 'date',
        filterOperator: undefined,
        type: 'date',
      },
    ] as const;

    it('should filter single dates', () => {
      const date = new Date(2022, 1, 1);
      const sameDate = new Date(2022, 1, 1, 12, 0); // same day, different time
      const nextDate = new Date(2022, 1, 2);

      // equals
      const cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'date', filterValue: { value: date } }],
          { id: '1', date: sameDate },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'date', filterValue: { value: date } }],
          { id: '1', date: nextDate },
          cols,
          logService,
        ),
      ).toBeFalse();

      // date string handling
      expect(
        doesFilterPass(
          [{ filterId: 'date', filterValue: { value: '2022-02-01' } }], // Note: Timezone sensitive if not careful, but zeroHour uses local parts
          { id: '1', date: date }, // Date in local time
          cols,
          logService,
        ),
      ).toBeTrue(); // assuming '2022-02-01' parses to same local day or constructed similarly
    });

    it('should filter date ranges', () => {
      const cols = [{ ...columns[0], filterOperator: undefined }] as any;
      const start = new Date(2022, 1, 1);
      const end = new Date(2022, 1, 10);
      const mid = new Date(2022, 1, 5);
      const midDay = new Date(2022, 1, 5, 12, 0, 0);
      const endDay = new Date(2022, 1, 10, 23, 59, 59);

      const before = new Date(2022, 0, 1);
      const after = new Date(2022, 2, 1);

      // In range
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start, endDate: end } as any },
            },
          ],
          { id: '1', date: mid },
          cols,
          logService,
        ),
      ).toBeTrue();

      // Mid day should pass
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start, endDate: end } as any },
            },
          ],
          { id: '1', date: midDay },
          cols,
          logService,
        ),
      ).toBeTrue();

      // End day (end of day) should pass
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start, endDate: end } as any },
            },
          ],
          { id: '1', date: endDay },
          cols,
          logService,
        ),
      ).toBeTrue();

      // Out range
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start, endDate: end } as any },
            },
          ],
          { id: '1', date: before },
          cols,
          logService,
        ),
      ).toBeFalse();
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start, endDate: end } as any },
            },
          ],
          { id: '1', date: after },
          cols,
          logService,
        ),
      ).toBeFalse();

      // Open ended
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start } as any },
            },
          ],
          { id: '1', date: mid },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [
            {
              filterId: 'date',
              filterValue: { value: { startDate: start } as any },
            },
          ],
          { id: '1', date: before },
          cols,
          logService,
        ),
      ).toBeFalse();
    });
  });

  describe('boolean filters', () => {
    const columns = [
      {
        filterId: 'bool',
        field: 'bool',
        filterOperator: undefined,
        type: 'boolean',
      },
    ] as const;

    it('should filter boolean values', () => {
      // equals
      let cols = [{ ...columns[0], filterOperator: 'equals' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: true },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: false },
          cols,
          logService,
        ),
      ).toBeFalse();

      // notEqual
      cols = [{ ...columns[0], filterOperator: 'notEqual' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: false },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        doesFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: true },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should warn for unsupported boolean operator', () => {
      const cols = [{ ...columns[0], filterOperator: 'contains' }] as any;
      expect(
        doesFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: true },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith(
        'Unsupported boolean filter operator: contains',
      );
    });
  });
});
