export function getThemeStylesheets(): string[] {
  return [
    'node_modules/@skyux/theme/css/sky.css',
    'node_modules/@skyux/theme/css/themes/modern/styles.css',
  ];
}

export function ensureSkyuxStylesheets(
  existingStylesheets: string[]
): string[] {
  existingStylesheets = existingStylesheets
    ? existingStylesheets.map((x) => {
        // Angular 13 prefers root-relative stylesheet URLs.
        // See: https://stackoverflow.com/a/67075714/6178885
        return x.startsWith('@skyux/') ? `node_modules/${x}` : x;
      })
    : [];
  return [...new Set(getThemeStylesheets().concat(existingStylesheets))];
}
