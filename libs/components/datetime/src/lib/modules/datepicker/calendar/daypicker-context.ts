/**
 * Information about a specific day in the calendar.
 * @internal
 */
export interface SkyDayPickerContext {
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
