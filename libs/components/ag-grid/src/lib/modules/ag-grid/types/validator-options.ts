export interface ValidatorOptions {
  validator?: (value: any, data?: any, rowIndex?: number) => boolean;
  validatorMessage?:
    | string
    | ((value: any, data?: any, rowIndex?: number) => string);
}
