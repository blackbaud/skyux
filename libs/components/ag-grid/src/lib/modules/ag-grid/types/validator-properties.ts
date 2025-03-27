import type { Observable } from 'rxjs';

export interface SkyAgGridValidatorProperties {
  getString?: (
    value: unknown,
    data?: unknown,
    rowIndex?: number | null,
  ) => string | Observable<string>;
  validator?: (
    value: unknown,
    data?: unknown,
    rowIndex?: number | null,
  ) => boolean;
  validatorMessage?:
    | string
    | ((value: unknown, data?: unknown, rowIndex?: number | null) => string);
}
