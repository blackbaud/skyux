export interface SkyAgGridDatepickerProperties {
  dateFormat?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  skyDatepickerNoValidate?: boolean;
  startingDay?: number;
}

/**
 * @deprecated Use SkyAgGridDatepickerProperties instead.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type SkyDatepickerProperties = SkyAgGridDatepickerProperties
