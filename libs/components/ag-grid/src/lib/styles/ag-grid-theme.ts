import type { SkyThemeSettings } from '@skyux/theme';

import type { Theme } from 'ag-grid-community';
import {
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
} from 'ag-grid-community';

const defaultsForAllThemes = {
  backgroundColor: 'var(--sky-background-color-page-default)',
  borderColor: 'var(--sky-border-color-neutral-medium)',
  borderRadius: 'var(--sky-border-radius-s, 3px)',
  cardShadow: 'none',
  cellEditingBorder: 'none',
  cellHorizontalPadding: 12,
  checkboxCheckedBackgroundColor:
    'var(--sky-color-background-selected-heavy, var(--sky-background-color-input-selected, transparent))',
  checkboxCheckedBorderColor: { ref: 'checkboxCheckedShapeColor' },
  checkboxCheckedShapeColor:
    'var(--sky-override-switch-checked-color, var(--sky-color-icon-inverse, var(--sky-text-color-default)))',
  checkboxIndeterminateBackgroundColor:
    'var(--sky-override-switch-checked-color, var(--sky-color-icon-inverse, transparent))',
  checkboxUncheckedBackgroundColor: 'transparent',
  checkboxUncheckedBorderColor: `var(
    --sky-border-color-neutral-medium-dark,
    var(--sky-border-color-neutral-medium)
  )`,
  checkboxCheckedShapeImage: {
    svg: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#212121"/></svg>`,
  },
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
  oddRowBackgroundColor: 'var(--sky-background-color-page-default)',
  pickerListBackgroundColor: { ref: 'backgroundColor' },
  popupShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
  rowBorderColor: 'var(--sky-border-color-neutral-medium)',
  rowHoverColor: 'transparent',
  secondaryForegroundColor: 'var(--sky-text-color-deemphasized)',
  selectedRowBackgroundColor: 'var(--sky-background-color-selected)',
  spacing: 4,
  textColor: 'var(--sky-text-color-default)',
  tooltipBackgroundColor: 'var(--sky-background-color-neutral-light)',
  wrapperBorderRadius: 0,
};
const defaultsForDataEntryGrid = {
  backgroundColor: 'var(--sky-background-color-page-default)',
  columnBorder: true,
  popupShadow: 'none',
};
const defaultThemeBase = {
  ...defaultsForAllThemes,
  backgroundColor: '#fbfbfb', //SkyDefaultDesignTokens.color.gray['01'],
  fontSize: 15,
  headerHeight: 37,
  inputFocusBorderColor: 'var(--sky-highlight-color-info)',
  rowHeight: 38,
  rangeSelectionBorderColor: 'var(--sky-highlight-color-info)',
};
const modernThemeBase = {
  ...defaultsForAllThemes,
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
  rowHeight: 60,
  rangeSelectionBorderColor: { ref: 'inputFocusBorderColor' },
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
  .withoutPart('iconSet')
  .withPart(colorSchemeLight)
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
  .withoutPart('iconSet')
  .withPart(colorSchemeLight)
  .withParams(modernThemeBase);

const SkyAgGridDataGridModernLightCompact =
  SkyAgGridDataGridModernLight.withParams(modernCompactThemeBase);

const SkyAgGridDataGridModernDark = themeQuartz
  .withoutPart('iconSet')
  .withPart(colorSchemeDark)
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
