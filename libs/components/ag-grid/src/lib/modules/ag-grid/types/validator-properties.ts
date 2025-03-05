export interface SkyAgGridValidatorProperties {
  validator?: (
    value: unknown,
    data?: unknown,
    rowIndex?: number | null,
  ) => boolean;
  validatorMessage?:
    | string
    | ((value: unknown, data?: unknown, rowIndex?: number | null) => string);
}
