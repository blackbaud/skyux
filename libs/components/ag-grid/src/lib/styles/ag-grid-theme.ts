import { SkyThemeSettings } from '@skyux/theme';

type SkyAgGridThemeType =
  `ag-theme-sky-${'data-entry-grid' | 'data-grid'}-${'default' | 'modern-light' | 'modern-dark' | 'modern-light-compact' | 'modern-dark-compact'}`;

export function agGridThemeIsCompact(
  themeSettings: SkyThemeSettings | undefined,
  compactLayout: boolean,
): boolean {
  return (
    themeSettings?.theme.name === 'modern' &&
    (compactLayout || themeSettings?.spacing.name === 'compact')
  );
}

export function agGridTheme(
  editable: boolean,
  themeSettings: SkyThemeSettings | undefined,
  compactLayout: boolean,
): SkyAgGridThemeType {
  let theme = `ag-theme-sky-${editable ? 'data-entry-grid' : 'data-grid'}-`;
  if (themeSettings?.theme.name === 'modern') {
    theme += `modern-${themeSettings.mode.name}`;
    if (agGridThemeIsCompact(themeSettings, compactLayout)) {
      theme += `-compact`;
    }
  } else {
    theme += 'default';
  }
  return theme as SkyAgGridThemeType;
}
