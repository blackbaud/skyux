export interface ValidatorOptions {
  validator?: (value: any) => boolean;
  validatorMessage?: string | ((value: any) => string);
}
