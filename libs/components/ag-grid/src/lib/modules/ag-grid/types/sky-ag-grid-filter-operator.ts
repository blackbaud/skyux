/**
 * Filter operators that can be used when applying filter-bar filters to AG Grid columns.
 */
export type SkyAgGridFilterOperator =
  // Text operators
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  // Number/Date operators
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  // Common operators
  | 'equals'
  | 'notEqual';
