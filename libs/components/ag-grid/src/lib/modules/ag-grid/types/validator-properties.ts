import { SkyAgGridValidatorMessageFunction } from './validator-message-function';

export interface SkyAgGridValidatorProperties {
  validator?: (
    value: unknown,
    data?: unknown,
    rowIndex?: number | null,
  ) => boolean;
  validatorMessage?: string | SkyAgGridValidatorMessageFunction;
}
