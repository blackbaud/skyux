export function getThemeStylesheets(): string[] {
  return [
    '@skyux/theme/css/sky.css',
    '@skyux/theme/css/themes/modern/styles.css',
  ];
}

export function ensureSkyuxStylesheets(
  existingStylesheets: string[] = [],
): string[] {
  return [...new Set(getThemeStylesheets().concat(existingStylesheets))];
}
