/**
 * Whether the keyboard event is the shortcut for setting the datepicker value to today's date.
 * @internal
 */
export function datepickerIsSetToTodayKey(event: KeyboardEvent): boolean {
  return event.key === 'F3';
}
