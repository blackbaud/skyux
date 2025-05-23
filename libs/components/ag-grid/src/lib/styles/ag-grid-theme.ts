import { SkyThemeSettings } from '@skyux/theme';

import {
  Theme,
  ThemeDefaultParams,
  colorSchemeLight,
  themeQuartz,
} from 'ag-grid-community';

const defaultsForAllThemes: Partial<ThemeDefaultParams> = {
  backgroundColor:
    'var(--sky-override-ag-grid-background-color, var(--sky-background-color-page-default))',
  borderColor:
    'var(--sky-override-ag-grid-border-color, var(--sky-color-border-separator-row))',
  borderRadius:
    'var(--sky-override-ag-grid-border-radius, var(--sky-border-radius-s))',
  cardShadow: 'none',
  cellHorizontalPadding:
    'var(--sky-override-ag-grid-cell-horizontal-padding, var(--sky-space-inset-letterbox-2_3-left-m))',
  cellEditingBorder:
    'var(--sky-override-ag-grid-cell-focus-border-width, var(--sky-border-width-input-focus)) solid var(--sky-override-ag-grid-cell-focus-border-color, var(--sky-color-border-input-focus))',
  checkboxCheckedBackgroundColor:
    'var(--sky-override-ag-grid-checkbox-selected-background-color, var(--sky-color-background-selected-heavy))',
  checkboxCheckedBorderColor: { ref: 'checkboxCheckedShapeColor' },
  checkboxCheckedShapeColor:
    'var(--sky-override-switch-checked-color, var(--sky-color-icon-inverse, var(--sky-text-color-default)))',
  checkboxIndeterminateBackgroundColor:
    'var(--sky-override-switch-checked-color, var(--sky-color-icon-inverse, transparent))',
  checkboxUncheckedBackgroundColor: 'transparent',
  checkboxUncheckedBorderColor: `var(
    --sky-override-ag-grid-checkbox-unchecked-border-color,
    var(--sky-color-border-input-base)
  )`,
  checkboxCheckedShapeImage: {
    svg: `<svg width="16" height="16" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.9884 3.54756C13.6244 3.16685 13.0164 3.1491 12.6302 3.50792L5.62682 10.0157L3.64517 8.03282C3.27275 7.66016 2.66443 7.65572 2.28646 8.0229C1.90848 8.39007 1.90397 8.98983 2.2764 9.36248L4.85162 11.9393C5.25487 12.3428 5.91121 12.3548 6.32932 11.9663L13.9482 4.88659C14.3343 4.52777 14.3523 3.92827 13.9884 3.54756Z" fill="#212121"/></svg>`,
  },
  fontFamily:
    'var(--sky-override-ag-grid-font-family, var(--sky-font-family-primary))',
  foregroundColor:
    'var(--sky-override-ag-grid-foreground-color, var(--sky-color-text-default))',
  headerBackgroundColor: 'var(--sky-background-color-page-default)',
  headerColumnBorder:
    'var(--sky-override-ag-grid-border-width, var(--sky-border-width-divider)) var(--sky-override-ag-grid-border-style, var(--sky-border-style-divider)) var(--sky-override-ag-grid-border-color, transparent)',
  headerColumnBorderHeight: '100%',
  headerColumnResizeHandleColor:
    'var(--sky-override-ag-grid-column-divider-color, var(--sky-color-border-column_divider))',
  headerColumnResizeHandleHeight:
    'var(--sky-override-ag-grid-header-resize-height, calc(var(--sky-font-line_height-body-m) * var(--sky-font-size-body-m)))',
  headerColumnResizeHandleWidth:
    'var(--sky-override-ag-grid-header-divider-width, var(--sky-border-width-divider))',
  headerFontFamily: { ref: 'fontFamily' },
  iconSize: 12,
  inputDisabledBackgroundColor: 'transparent',
  inputFocusBorder: 'transparent',
  inputFocusShadow: 'none',
  invalidColor:
    'var(--sky-override-ag-grid-invalid-color, var(--sky-color-background-action-danger-base))',
  listItemHeight: { ref: 'rowHeight' },
  oddRowBackgroundColor: 'var(--sky-background-color-page-default)',
  pickerListBackgroundColor: { ref: 'backgroundColor' },
  popupShadow:
    'var(--sky-override-ag-grid-popup-shadow, var(--sky-elevation-overlay-300))',
  headerHeight:
    'var(--sky-override-ag-grid-header-height, calc(calc(var(--sky-font-line_height-body-m) * var(--sky-font-size-body-m)) + calc(var(--sky-space-inset-letterbox-2_3-top-m) + var(--sky-space-inset-letterbox-2_3-bottom-m))))',
  rowHeight:
    'var(--sky-override-ag-grid-row-height, calc(calc(var(--sky-font-line_height-body-m) * var(--sky-font-size-body-m)) + calc(var(--sky-space-inset-letterbox-2_3-top-m) + var(--sky-space-inset-letterbox-2_3-bottom-m))))',
  rowHoverColor: 'transparent',
  selectedRowBackgroundColor:
    'var(--sky-override-ag-grid-row-selected-color, var(--sky-color-background-selected-soft))',
  // the only thing I can find this impacting is the resize handle (gets this value x 4), but leaving it in bc it could impact other things
  spacing: 4,
  textColor:
    'var(--sky-override-ag-grid-text-color, var(--sky-color-text-default))',
  tooltipBackgroundColor:
    'var(--sky-override-ag-grid-tooltip-background-color, var(--sky-color-background-container-base))',
  wrapperBorderRadius: 0,
  fontSize:
    'var(--sky-override-ag-grid-font-size, var(--sky-font-size-body-m))',
  rangeSelectionBorderColor:
    'var(--sky-override-ag-grid-range-selection-border-color, var(--sky-color-border-input-focus))',
  rowBorder:
    'var(--sky-override-ag-grid-row-border-width, var(--sky-border-width-separator-row)) var(--sky-override-ag-grid-row-border-style, var(--sky-border-style-separator-row)) var(--sky-override-ag-grid-border-color, var(--sky-color-border-separator-row))',
  headerRowBorder:
    'var(--sky-override-ag-grid-row-border-width, var(--sky-border-width-separator-row)) var(--sky-override-ag-grid-header-row-border-style, var(--sky-border-style-separator-row)) var(--sky-override-ag-grid-border-color, var(--sky-color-border-separator-row))',
};

const defaultsForDataEntryGrid = {
  columnBorder:
    'var(--sky-override-ag-grid-column-border, var(--sky-border-width-separator-row) solid var(--sky-color-border-separator-row))',
  popupShadow: 'none',
  rowBorder:
    'var(--sky-override-ag-grid-row-border-width, var(--sky-border-width-separator-row)) solid var(--sky-override-ag-grid-border-color, var(--sky-color-border-separator-row))',
  headerRowBorder:
    'var(--sky-override-ag-grid-row-border-width, var(--sky-border-width-emphasized)) solid var(--sky-override-ag-grid-border-color, var(--sky-color-border-separator-row))',
};

const SkyAgGridDataGrid = themeQuartz
  .withoutPart('iconSet')
  .withPart(colorSchemeLight)
  .withParams(defaultsForAllThemes);

const SkyAgGridDataEntryGrid = SkyAgGridDataGrid.withParams(
  defaultsForDataEntryGrid,
);

export function getSkyAgGridTheme(
  grid: 'data-entry-grid' | 'data-grid',
): Theme {
  if (grid === 'data-grid') {
    return SkyAgGridDataGrid;
  } else {
    return SkyAgGridDataEntryGrid;
  }
}

type SkyAgGridThemeType =
  `ag-theme-sky-${'data-entry-grid' | 'data-grid'}-${'default' | 'modern-light' | 'modern-light-compact'}`;

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
