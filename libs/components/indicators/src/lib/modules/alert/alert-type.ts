/**
 * Specifies a style for the alert to determine the icon and background color.
 */
export type SkyAlertType =
  | 'danger'
  | 'info'
  | 'success'
  | 'warning'
  // Add 'string' for backward compatibility.
  | string;
