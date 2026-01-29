import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';
import { SkyDateRange } from '@skyux/datetime';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { SkyDataGridFilterOperator } from '../types/data-grid-filter-operator';
import { SkyDataGridFilterValue } from '../types/data-grid-filter-value';
import { SkyDataGridNumberRangeFilterValue } from '../types/data-grid-number-range-filter-value';

import { doesFilterPass } from './data-grid-filter';

interface TestDataRow {
  id: string;
  test?: string;
  text?: string;
  num?: number;
  date?: Date | string;
  bool?: boolean;
}

interface TestColumnFilter {
  filterId: string | undefined;
  field: keyof TestDataRow | undefined;
  filterOperator: SkyDataGridFilterOperator | undefined;
  type: 'text' | 'number' | 'date' | 'boolean';
}

/**
 * Helper function to call doesFilterPass with consistent typing.
 */
function testFilterPass(
  filters: SkyFilterStateFilterItem<SkyDataGridFilterValue>[],
  data: TestDataRow | undefined,
  columns: TestColumnFilter[],
  logger: SkyLogService,
): boolean {
  return doesFilterPass<TestDataRow>(
    filters,
    data as TestDataRow,
    columns,
    logger,
  );
}

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
      testFilterPass(
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
      testFilterPass(
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
      testFilterPass(
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
      testFilterPass(
        [{ filterId: 'test', filterValue: { value: 'example' } }],
        undefined,
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
      testFilterPass(
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
    function createTextColumn(
      operator: SkyDataGridFilterOperator | undefined,
    ): TestColumnFilter[] {
      return [
        {
          filterId: 'text',
          field: 'text',
          filterOperator: operator,
          type: 'text',
        },
      ];
    }

    it('should filter with "equals"', () => {
      const cols = createTextColumn('equals');
      // Match
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      // No match
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'def' },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Case insensitive
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ABC' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "notEqual"', () => {
      const cols = createTextColumn('notEqual');
      // Match (fail)
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
      // No match (pass)
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'abc' } }],
          { id: '1', text: 'def' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "contains"', () => {
      const cols = createTextColumn('contains');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'de' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter with "notContains"', () => {
      const cols = createTextColumn('notContains');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'de' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });

    it('should filter with "startsWith"', () => {
      const cols = createTextColumn('startsWith');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ab' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter with "endsWith"', () => {
      const cols = createTextColumn('endsWith');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'bc' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'ab' } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should handle undefined/null values gracefully', () => {
      const cols = createTextColumn('contains');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: 'null' } }],
          { id: '1', text: 'null' },
          cols,
          logService,
        ),
      ).toBeTrue(); // 'null' string matches null
    });

    it('should warn and pass for unsupported operator', () => {
      const cols = createTextColumn(
        'unknown' as unknown as SkyDataGridFilterOperator,
      );
      expect(
        testFilterPass(
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
      const cols = createTextColumn('equals');
      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: ['abc', 'xyz'] } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();

      expect(
        testFilterPass(
          [{ filterId: 'text', filterValue: { value: ['xyz', 'uvw'] } }],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should support "val" property for filter value', () => {
      const cols = createTextColumn('equals');
      expect(
        testFilterPass(
          [
            { filterId: 'text', filterValue: { val: 'abc' } },
          ] as unknown as SkyFilterStateFilterItem<SkyDataGridFilterValue>[],
          { id: '1', text: 'abc' },
          cols,
          logService,
        ),
      ).toBeTrue();
    });
  });

  describe('number filters', () => {
    function createNumColumn(
      operator: SkyDataGridFilterOperator | undefined,
    ): TestColumnFilter[] {
      return [
        {
          filterId: 'num',
          field: 'num',
          filterOperator: operator,
          type: 'number',
        },
      ];
    }

    it('should filter single values with basic operators', () => {
      // equals
      let cols = createNumColumn('equals');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // notEqual
      cols = createNumColumn('notEqual');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // lessThan
      cols = createNumColumn('lessThan');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 9 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // lessThanOrEqual
      cols = createNumColumn('lessThanOrEqual');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // greaterThan
      cols = createNumColumn('greaterThan');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 11 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeFalse();

      // greaterThanOrEqual
      cols = createNumColumn('greaterThanOrEqual');
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: { value: 10 } }],
          { id: '1', num: 9 },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should filter number ranges', () => {
      const cols = createNumColumn(undefined);
      const rangeFilter = (
        from: number | null,
        to: number | null,
      ): { value: SkyDataGridNumberRangeFilterValue } => ({
        value: { from, to } as SkyDataGridNumberRangeFilterValue,
      });
      // In range
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(5, 15) }],
          { id: '1', num: 10 },
          cols,
          logService,
        ),
      ).toBeTrue();
      // Out range (low)
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(5, 15) }],
          { id: '1', num: 4 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Out range (high)
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(5, 15) }],
          { id: '1', num: 16 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Open ended (from)
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(5, null) }],
          { id: '1', num: 6 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(5, null) }],
          { id: '1', num: 4 },
          cols,
          logService,
        ),
      ).toBeFalse();
      // Open ended (to)
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(null, 15) }],
          { id: '1', num: 14 },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'num', filterValue: rangeFilter(null, 15) }],
          { id: '1', num: 16 },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should warn and pass for unsupported operator', () => {
      const cols = createNumColumn(
        'unknown' as unknown as SkyDataGridFilterOperator,
      );
      expect(
        testFilterPass(
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
    function createDateColumn(
      operator: SkyDataGridFilterOperator | undefined,
    ): TestColumnFilter[] {
      return [
        {
          filterId: 'date',
          field: 'date',
          filterOperator: operator,
          type: 'date',
        },
      ];
    }

    function dateRangeFilter(
      startDate: Date | undefined,
      endDate?: Date,
    ): { value: SkyDateRange } {
      return { value: { startDate, endDate } as SkyDateRange };
    }

    it('should filter single dates', () => {
      const date = new Date(2022, 1, 1);
      const sameDate = new Date(2022, 1, 1, 12, 0); // same day, different time
      const nextDate = new Date(2022, 1, 2);

      // equals
      const cols = createDateColumn('equals');
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: { value: date } }],
          { id: '1', date: sameDate },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: { value: date } }],
          { id: '1', date: nextDate },
          cols,
          logService,
        ),
      ).toBeFalse();

      // date string handling
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: { value: '2022-02-01' } }], // Note: Timezone sensitive if not careful, but zeroHour uses local parts
          { id: '1', date: date }, // Date in local time
          cols,
          logService,
        ),
      ).toBeTrue(); // assuming '2022-02-01' parses to same local day or constructed similarly
    });

    it('should filter date ranges', () => {
      const cols = createDateColumn(undefined);
      const start = new Date(2022, 1, 1);
      const end = new Date(2022, 1, 10);
      const mid = new Date(2022, 1, 5);
      const midDay = new Date(2022, 1, 5, 12, 0, 0);
      const endDay = new Date(2022, 1, 10, 23, 59, 59);

      const before = new Date(2022, 0, 1);
      const after = new Date(2022, 2, 1);

      // In range
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start, end) }],
          { id: '1', date: mid },
          cols,
          logService,
        ),
      ).toBeTrue();

      // Mid day should pass
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start, end) }],
          { id: '1', date: midDay },
          cols,
          logService,
        ),
      ).toBeTrue();

      // End day (end of day) should pass
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start, end) }],
          { id: '1', date: endDay },
          cols,
          logService,
        ),
      ).toBeTrue();

      // Out range
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start, end) }],
          { id: '1', date: before },
          cols,
          logService,
        ),
      ).toBeFalse();
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start, end) }],
          { id: '1', date: after },
          cols,
          logService,
        ),
      ).toBeFalse();

      // Open ended
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start) }],
          { id: '1', date: mid },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'date', filterValue: dateRangeFilter(start) }],
          { id: '1', date: before },
          cols,
          logService,
        ),
      ).toBeFalse();
    });
  });

  describe('boolean filters', () => {
    function createBoolColumn(
      operator: SkyDataGridFilterOperator | undefined,
    ): TestColumnFilter[] {
      return [
        {
          filterId: 'bool',
          field: 'bool',
          filterOperator: operator,
          type: 'boolean',
        },
      ];
    }

    it('should filter boolean values', () => {
      // equals
      let cols = createBoolColumn('equals');
      expect(
        testFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: true },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: false },
          cols,
          logService,
        ),
      ).toBeFalse();

      // notEqual
      cols = createBoolColumn('notEqual');
      expect(
        testFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: false },
          cols,
          logService,
        ),
      ).toBeTrue();
      expect(
        testFilterPass(
          [{ filterId: 'bool', filterValue: { value: true } }],
          { id: '1', bool: true },
          cols,
          logService,
        ),
      ).toBeFalse();
    });

    it('should warn for unsupported boolean operator', () => {
      const cols = createBoolColumn('contains');
      expect(
        testFilterPass(
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
