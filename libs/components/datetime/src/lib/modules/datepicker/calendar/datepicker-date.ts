/**
 * Represents the selected date in the calendar picker.
 * TODO: Consider renaming this interface to better fit its purpose.
 * @internal
 */
export interface SkyDatepickerDate {
  date: Date;
  label: string;
  selected: boolean;
  disabled: boolean;
  current: boolean;
  secondary: boolean;
  uid: string;
  keyDate?: boolean;
  keyDateText?: string[];
}
