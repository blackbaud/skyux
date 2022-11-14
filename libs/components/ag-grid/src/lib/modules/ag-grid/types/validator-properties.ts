export interface SkyAgGridValidatorProperties {
  validator?: (value: unknown, data?: unknown, rowIndex?: number) => boolean;
  validatorMessage?:
    | string
    | ((value: unknown, data?: unknown, rowIndex?: number) => string);
}
