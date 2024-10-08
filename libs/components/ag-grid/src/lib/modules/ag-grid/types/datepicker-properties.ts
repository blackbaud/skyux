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
// eslint-disable-next-line
export interface SkyDatepickerProperties
  extends SkyAgGridDatepickerProperties {}
