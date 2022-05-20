import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';
import { SkyHostBrowserBreakpoint } from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import { $, ExpectedConditions, browser, by, element } from 'protractor';

let currentTheme: string;
let currentThemeMode: string;

async function selectTheme(theme: string, mode: string): Promise<void> {
  currentTheme = theme;
  currentThemeMode = mode;

  return SkyVisualThemeSelector.selectTheme(theme, mode);
}

function getScreenshotName(name: string, size: string): string {
  if (currentTheme) {
    name += '-' + currentTheme;
  }

  if (currentThemeMode) {
    name += '-' + currentThemeMode;
  }

  name += '-' + size;

  return name;
}

function cycleThroughThemes(runTests: () => void) {
  runTests();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
      await browserPause();
    });

    runTests();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
      await browserPause();
    });

    runTests();
  });
}

function browserPause() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

async function scrollIntoView(selector: string) {
  return browser.executeScript(
    `return document.querySelector(${JSON.stringify(
      selector
    )}).scrollIntoView({ block: "center", inline: "center" })`
  );
}

describe('Editable grid', () => {
  // selectors
  const dateCell = '.sky-ag-grid-cell-editable.sky-ag-grid-cell-date';
  const autocompleteCell =
    '.sky-ag-grid-cell-editable.sky-ag-grid-cell-autocomplete';
  const editButton = '#edit-btn';
  const editableGrid = '.editable-grid';
  const sortableHeaderCell = '.ag-header-cell-sortable';

  function runTests(): void {
    describe('read mode', () => {
      async function matchesPreviousEditableGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await SkyHostBrowser.moveCursorOffScreen();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName('editable-grid-read', screenSize),
        });
      }

      it('should match previous editable grid on large screens', async (done) => {
        await matchesPreviousEditableGrid('lg', done);
      });

      it('should match previous editable grid on extra small screens', async (done) => {
        await matchesPreviousEditableGrid('xs', done);
      });
    });

    describe('edit mode', () => {
      async function matchesPreviousEditableGridInEditMode(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName('editable-grid-edit', screenSize),
        });
      }

      it('should match previous editable grid on large screens', async (done) => {
        await matchesPreviousEditableGridInEditMode('lg', done);
      });

      it('should match previous editable grid on extra small screens', async (done) => {
        await matchesPreviousEditableGridInEditMode('xs', done);
      });
    });

    describe('descending sort', () => {
      async function matchesPreviousDescendingSortGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(sortableHeaderCell))
        );
        await element(by.css(sortableHeaderCell)).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-sort-desc',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousDescendingSortGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousDescendingSortGrid('xs', done);
      });
    });

    describe('ascending sort', () => {
      async function matchesPreviousAscendingSortGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        // click twice to sort by descending then ascending
        await browser.wait(
          ExpectedConditions.elementToBeClickable($(sortableHeaderCell))
        );
        await element(by.css(sortableHeaderCell)).click();
        await browserPause();
        await element(by.css(sortableHeaderCell)).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-sort-asc',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousAscendingSortGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousAscendingSortGrid('xs', done);
      });
    });

    describe('number editing', () => {
      async function matchesPreviousNumberEditingGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await scrollIntoView(
          '.sky-ag-grid-cell-editable.sky-ag-grid-cell-number'
        );
        await element(
          by.css('.sky-ag-grid-cell-editable.sky-ag-grid-cell-number')
        ).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-number',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousNumberEditingGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousNumberEditingGrid('xs', done);
      });
    });

    describe('text editing', () => {
      async function matchesPreviousTextEditingGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await element(
          by.css('.sky-ag-grid-cell-editable.sky-ag-grid-cell-text')
        ).click();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-text',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousTextEditingGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousTextEditingGrid('xs', done);
      });
    });

    describe('date text input editing', () => {
      async function matchesPreviousDateTextEditingGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await element(by.css(dateCell)).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-date',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousDateTextEditingGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousDateTextEditingGrid('xs', done);
      });
    });

    describe('autocomplete input editing', () => {
      async function matchesPreviousAutocompleteInputEditingGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await element(by.css(autocompleteCell)).click();
        await browserPause();

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-autocomplete-input',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousAutocompleteInputEditingGrid('lg', done);
      });
    });

    describe('autocomplete dropdown editing', () => {
      async function matchesPreviousAutocompleteDropdownEditingGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        const cell = element(by.css(autocompleteCell));
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await browser.wait(ExpectedConditions.elementToBeClickable(cell));
        await cell.click();
        const input = element(by.css(`${autocompleteCell} input`));
        input.value = 'j';
        await input.sendKeys('j');

        await browser.wait(
          ExpectedConditions.presenceOf(
            element(by.css('.sky-autocomplete-results'))
          ),
          1200,
          'Autocomplete results dropdown took too long to appear.'
        );

        expect(editableGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-autocomplete-dropdown',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousAutocompleteDropdownEditingGrid('lg', done);
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;
    await SkyHostBrowser.get('visual/editable-grid');
  });

  cycleThroughThemes(runTests);
});

describe('Editable grid, complex cells', () => {
  // selectors
  const selectCell = '.ag-body-viewport [row-id="0"] [col-id="language"]';
  const selectCellTrigger = selectCell + ' .ag-picker-field-display';
  const selectList = '.ag-select-list';
  const validatorCellAutocomplete =
    '.ag-body-viewport [row-id="1"] > .ag-cell.sky-ag-grid-cell-autocomplete.sky-ag-grid-cell-invalid';
  const validatorCellCurrency =
    '.ag-body-viewport [row-id="2"] > .ag-cell.sky-ag-grid-cell-currency.sky-ag-grid-cell-invalid';
  const validatorCellDate =
    '.ag-body-viewport [row-id="1"] > .ag-cell.sky-ag-grid-cell-date.sky-ag-grid-cell-invalid';
  const lookupCellSingle =
    '.ag-body-viewport [row-id="1"] > .ag-cell.sky-ag-grid-cell-lookup[col-id="lookupSingle"]';
  const lookupCellMultiple =
    '.ag-body-viewport [row-id="1"] > .ag-cell.sky-ag-grid-cell-lookup[col-id="lookupMultiple"]';
  const popupEditor = '.ag-popup-editor';
  const editButton = '#edit-btn';

  function runTests(): void {
    describe('select focus', () => {
      async function matchesPreviousSelectFocus(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);
        await browserPause();

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await scrollIntoView(selectCell);
        await element(by.css(selectCell)).click();
        await browserPause();

        expect(selectCell).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-select-focus',
            screenSize
          ),
        });
      }

      async function matchesPreviousSelectList(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);
        await browserPause();

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await scrollIntoView(selectCell);
        await element(by.css(selectCell)).click();
        await browserPause();
        await element(by.css(selectCellTrigger)).click();
        await browserPause();

        expect(selectList).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            'editable-grid-edit-select-list',
            screenSize
          ),
        });
      }

      it('should match previous screenshot on large screens - focus', async (done) => {
        await matchesPreviousSelectFocus('lg', done);
      });

      it('should match previous screenshot on large screens - list', async (done) => {
        await matchesPreviousSelectList('lg', done);
      });

      it('should match previous screenshot on extra small screens - focus', async (done) => {
        await matchesPreviousSelectFocus('xs', done);
      });

      it('should match previous screenshot on extra small screens - list', async (done) => {
        await matchesPreviousSelectList('xs', done);
      });
    });

    describe('validator', () => {
      [
        {
          summary: 'invalid',
          selector: validatorCellCurrency,
        },
        {
          summary: 'invalid-autocomplete',
          selector: validatorCellAutocomplete,
        },
        {
          summary: 'invalid-date',
          selector: validatorCellDate,
        },
      ].forEach((scenario) => {
        it(`should match previous screenshot on large screens - ${scenario.summary}`, async (done) => {
          const screenSize = 'lg';
          await SkyHostBrowser.setWindowBreakpoint(screenSize);
          await SkyHostBrowser.moveCursorOffScreen();
          await browserPause();

          expect(scenario.selector).toMatchBaselineScreenshot(done, {
            screenshotName: getScreenshotName(
              `editable-grid-edit-validator-${scenario.summary}`,
              screenSize
            ),
          });
        });
      });
    });

    [
      {
        summary: 'single',
        selector: lookupCellSingle,
      },
      {
        summary: 'multiple',
        selector: lookupCellMultiple,
      },
    ].forEach((scenario) => {
      describe(`lookup ${scenario.summary} value`, () => {
        it('should match previous screenshot on large screens', async (done) => {
          const screenSize = 'lg';
          await SkyHostBrowser.setWindowBreakpoint(screenSize);

          await browser.wait(
            ExpectedConditions.elementToBeClickable($(editButton))
          );
          await element(by.css(editButton)).click();

          await scrollIntoView(scenario.selector);
          await element(by.css(scenario.selector)).click();
          await browserPause();
          await SkyHostBrowser.moveCursorOffScreen();
          expect(popupEditor).toMatchBaselineScreenshot(done, {
            screenshotName: getScreenshotName(
              `editable-grid-edit-lookup-${scenario.summary}-value`,
              screenSize
            ),
          });
        });
      });
    });

    describe(`custom multiline`, () => {
      it('should match previous screenshot on large screens', async (done) => {
        const screenSize = 'lg';
        const selector = 'div[row-index="4"] div[col-id="custom-multiline"]';
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await browser.wait(
          ExpectedConditions.elementToBeClickable($(editButton))
        );
        await element(by.css(editButton)).click();

        await scrollIntoView(selector);
        await SkyHostBrowser.moveCursorOffScreen();
        await browserPause();
        expect(selector).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            `editable-grid-custom-multiline-value`,
            screenSize
          ),
        });
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;
    await SkyHostBrowser.get('visual/edit-complex-cells');
  });

  cycleThroughThemes(runTests);
});
