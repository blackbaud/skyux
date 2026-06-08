export const NATIVE_FORM_CONTROLS = new Set(['input', 'select', 'textarea']);
export const VALID_INPUT_BOX_INPUT_TYPES = new Set([
  'email',
  'number',
  'password',
  'text',
  'url',
  // Excludes month, week, and range types since their native UI doesn't fit well within the input box design.
]);
export const VALID_INPUT_BOX_SKY_COMPONENTS = new Set([
  'sky-autocomplete',
  'sky-country-field',
  'sky-datepicker',
  'sky-lookup',
  'sky-phone-field',
  'sky-timepicker',
]);
