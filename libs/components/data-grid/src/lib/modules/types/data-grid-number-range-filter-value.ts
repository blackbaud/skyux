/**
 * Filter value for number range filters.
 */
export type SkyDataGridNumberRangeFilterValue =
  | {
      /**
       * The minimum value of the range.
       */
      from: number;
      /**
       * The maximum value of the range.
       */
      to: number;
    }
  | {
      /**
       * The minimum value of the range. Null indicates no minimum.
       */
      from: null;
      /**
       * The maximum value of the range.
       */
      to: number;
    }
  | {
      /**
       * The minimum value of the range.
       */
      from: number;
      /**
       * The maximum value of the range. Null indicates no maximum.
       */
      to: null;
    };
