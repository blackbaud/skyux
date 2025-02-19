import { SkyThemeSettings } from '@skyux/theme';

import {
  Theme,
  colorSchemeDark,
  colorSchemeLight,
  iconSetAlpine,
  themeQuartz,
} from 'ag-grid-community';

const defaultsForAllThemes = {
  borderColor: 'var(--sky-border-color-neutral-medium)',
  cardShadow: 'none',
  cellHorizontalPadding: 12,
  checkboxCheckedBackgroundColor: 'transparent',
  checkboxIndeterminateBackgroundColor: 'transparent',
  checkboxUncheckedBackgroundColor: 'transparent',
  // eslint-disable-next-line @cspell/spellchecker
  fontFamily: ['BLKB Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
  foregroundColor: 'var(--sky-text-color-default)',
  headerBackgroundColor: 'var(--sky-background-color-page-default)',
  headerColumnBorder: {
    style: 'solid' as const,
    width: 1,
    color: { ref: 'borderColor' },
  },
  headerColumnBorderHeight: '100%',
  headerColumnResizeHandleColor: 'var(--sky-border-color-neutral-medium)',
  headerColumnResizeHandleHeight: '100%',
  headerColumnResizeHandleWidth: 1,
  headerFontFamily: { ref: 'fontFamily' },
  iconSize: 12,
  inputDisabledBackgroundColor: 'transparent',
  inputFocusBorder: 'transparent',
  inputFocusShadow: 'none',
  invalidColor: 'var(--sky-background-color-danger-dark)',
  listItemHeight: { ref: 'rowHeight' },
  oddRowBackgroundColor: { ref: 'headerBackgroundColor' },
  pickerListBackgroundColor: { ref: 'backgroundColor' },
  popupShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
  rowHoverColor: 'transparent',
  selectedRowBackgroundColor: 'var(--sky-background-color-selected)',
  spacing: 4,
  textColor: 'var(--sky-text-color-default)',
  tooltipBackgroundColor: 'var(--sky-background-color-neutral-light)',
  wrapperBorderRadius: 0,
};
const defaultsForDataEntryGrid = {
  backgroundColor: 'var(--sky-background-color-neutral-light)',
  columnBorder: true,
  headerBackgroundColor: 'var(--sky-background-color-neutral-light)',
  popupShadow: 'none',
};
const defaultThemeBase = {
  ...defaultsForAllThemes,
  backgroundColor: '#fbfbfb', //SkyDefaultDesignTokens.color.gray['01'],
  fontSize: 15,
  headerHeight: 37,
  inputFocusBorderColor: 'var(--sky-highlight-color-info)',
  rowBorderColor: 'var(--sky-border-color-neutral-medium)',
  rowHeight: 38,
  rangeSelectionBorderColor: 'var(--sky-highlight-color-info)',
  secondaryForegroundColor: 'var(--sky-text-color-deemphasized)',
};
const modernThemeBase = {
  ...defaultsForAllThemes,
  backgroundColor: 'var(--sky-background-color-page-default)',
  fontSize: 16,
  headerColumnBorder: {
    style: 'solid' as const,
    width: 1,
    color: 'transparent',
  },
  headerColumnResizeHandleColor: { ref: 'headerBackgroundColor' },
  headerColumnSeparatorColor: { ref: 'headerBackgroundColor' },
  headerHeight: 60,
  inputFocusBorderColor: '#1870B8', // SkyModernDesignTokens['border-color']['primary-dark'],
  rowBorderColor: 'var(--sky-border-color-neutral-medium)',
  rowHeight: 60,
  rangeSelectionBorderColor: 'var(--sky-highlight-color-info)',
  secondaryForegroundColor: 'var(--sky-text-color-deemphasized)',
};
const modernCompactThemeBase = {
  headerHeight: 32,
  rowHeight: 32,
};
const modernThemeDarkBase = {
  ...defaultsForAllThemes,
  fontSize: 16,
  headerHeight: 60,
  rowHeight: 60,
};

const SkyAgGridDataGridDefault = themeQuartz
  .withPart(colorSchemeLight)
  .withPart(iconSetAlpine)
  .withParams(defaultThemeBase);

const SkyAgGridDataEntryGridDefault = SkyAgGridDataGridDefault.withParams(
  defaultsForDataEntryGrid,
).withParams({
  cellHorizontalPadding: '11px',
  columnBorder: {
    style: 'solid' as const,
    width: 1,
    color: { ref: 'borderColor' },
  },
});

const SkyAgGridDataGridModernLight = themeQuartz
  .withPart(colorSchemeLight)
  .withPart(iconSetAlpine)
  .withParams(modernThemeBase);

const SkyAgGridDataGridModernLightCompact =
  SkyAgGridDataGridModernLight.withParams(modernCompactThemeBase);

const SkyAgGridDataGridModernDark = themeQuartz
  .withPart(colorSchemeDark)
  .withPart(iconSetAlpine)
  .withParams(modernThemeDarkBase);

const SkyAgGridDataGridModernDarkCompact =
  SkyAgGridDataGridModernDark.withParams(modernCompactThemeBase);

const SkyAgGridDataEntryGridModernLight =
  SkyAgGridDataGridModernLight.withParams(defaultsForDataEntryGrid).withParams({
    backgroundColor: '#ffffff',
  });

const SkyAgGridDataEntryGridModernLightCompact =
  SkyAgGridDataGridModernLightCompact.withParams(defaultsForDataEntryGrid);

const SkyAgGridDataEntryGridModernDark = SkyAgGridDataGridModernDark.withParams(
  defaultsForDataEntryGrid,
);

const SkyAgGridDataEntryGridModernDarkCompact =
  SkyAgGridDataGridModernDarkCompact.withParams(defaultsForDataEntryGrid);

export function getSkyAgGridTheme(
  grid: 'data-entry-grid' | 'data-grid',
  theme: string | undefined,
  mode: string | undefined,
  spacing: string | undefined,
): Theme {
  if (grid === 'data-grid') {
    if (theme === 'modern') {
      if (mode === 'dark') {
        if (spacing === 'compact') {
          return SkyAgGridDataGridModernDarkCompact;
        } else {
          return SkyAgGridDataGridModernDark;
        }
      } else {
        if (spacing === 'compact') {
          return SkyAgGridDataGridModernLightCompact;
        } else {
          return SkyAgGridDataGridModernLight;
        }
      }
    } else {
      return SkyAgGridDataGridDefault;
    }
  } else {
    if (theme === 'modern') {
      if (mode === 'dark') {
        if (spacing === 'compact') {
          return SkyAgGridDataEntryGridModernDarkCompact;
        } else {
          return SkyAgGridDataEntryGridModernDark;
        }
      } else {
        if (spacing === 'compact') {
          return SkyAgGridDataEntryGridModernLightCompact;
        } else {
          return SkyAgGridDataEntryGridModernLight;
        }
      }
    } else {
      return SkyAgGridDataEntryGridDefault;
    }
  }
}

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

export function getSkyAgGridThemeClassName(
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
