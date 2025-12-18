/**
 * Filter operators that can be used when applying filter-bar filters to AG Grid columns.
 */
export type SkyAgGridFilterOperator =
  // Text operators
  | 'equals'
  | 'notEqual'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  // Number/Date operators
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'inRange'
  // Common operators
  | 'blank'
  | 'notBlank';
