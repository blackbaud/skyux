import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  DragulaService
} from 'ng2-dragula/ng2-dragula';

import {
  Observable
} from 'rxjs/Observable';

const moment = require('moment');

import {
  GridEmptyTestComponent
} from './fixtures/grid-empty.component.fixture';

import {
  GridDynamicTestComponent
} from './fixtures/grid-dynamic.component.fixture';

import {
  GridAsyncTestComponent
} from './fixtures/grid-async.component.fixture';

import {
  GridFixturesModule
} from './fixtures/grid-fixtures.module';

import {
  GridTestComponent
} from './fixtures/grid.component.fixture';

import {
  GridInteractiveTestComponent
} from './fixtures/grid-interactive.component.fixture';

import {
  GridUndefinedTestComponent
} from './fixtures/grid-undefined.component.fixture';

import {
  MockDragulaService
} from './fixtures/mock-dragula.service';

import {
  SkyGridComponent,
  SkyGridColumnModel
} from './';

import {
  SkyGridSelectedRowsModelChange,
  SkyGridMessageType,
  SkyGridMessage
} from './types';

//#region helpers
function getColumnHeader(id: string, element: DebugElement) {
  return element.query(
    By.css('th[sky-cmp-id="' + id + '"]')
  );
}

function getCell(rowId: string, columnId: string, element: DebugElement) {
  return element.query(
    By.css('tr[sky-cmp-id="' + rowId + '"] sky-grid-cell[sky-cmp-id="' + columnId + '"]')
  );
}

function getElementCords(elementRef: any) {
  const rect = (elementRef.nativeElement as HTMLElement).getBoundingClientRect();
  const coords = {
    x: Math.round(rect.left + (rect.width / 2)),
    y: Math.round(rect.top + (rect.height / 2))
  };

  return coords;
}

function getColumnWidths(fixture: ComponentFixture<any>) {
  let expectedColumnWidths = new Array<number>();
  const tableHeaders = fixture.debugElement.queryAll(By.css('.sky-grid-heading'));
  tableHeaders.forEach(th => {
    expectedColumnWidths.push(Number(th.nativeElement.offsetWidth));
  });

  return expectedColumnWidths;
}

function getColumnResizeHandles(fixture: ComponentFixture<any>) {
  return fixture.debugElement.queryAll(By.css('.sky-grid-resize-handle'));
}

function getColumnRangeInputs(fixture: ComponentFixture<any>) {
  return fixture.debugElement.queryAll(By.css('.sky-grid-column-input-aria-only'));
}

function getColumnResizeInputMaxValues(fixture: ComponentFixture<any>) {
  let resizeInputs = getColumnRangeInputs(fixture);
  let maxValues = new Array<number>();

  resizeInputs.forEach((input) => {
    maxValues.push(input.nativeElement.max);
  });
  return maxValues;
}

function resizeColumn(fixture: ComponentFixture<any>, deltaX: number, columnIndex: number) {
  const resizeHandles = getColumnResizeHandles(fixture);
  let axis = getElementCords(resizeHandles[columnIndex]);
  let event = {
    target: resizeHandles[columnIndex].nativeElement,
    'pageX': axis.x,
    'preventDefault': function () { },
    'stopPropagation': function () { }
  };

  resizeHandles[columnIndex].triggerEventHandler('mousedown', event);
  fixture.detectChanges();

  let evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('mousemove', false, false, window, 0, 0, 0, axis.x + deltaX,
    0, false, false, false, false, 0, undefined);
  document.dispatchEvent(evt);
  fixture.detectChanges();
  evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('mouseup', false, false, window, 0, 0, 0, axis.x + deltaX,
    0, false, false, false, false, 0, undefined);
  document.dispatchEvent(evt);
  fixture.detectChanges();
}

function resizeColumnByRangeInput(fixture: ComponentFixture<any>, columnIndex: number, deltaX: number) {
  const resizeInputs = getColumnRangeInputs(fixture);
  SkyAppTestUtility.fireDomEvent(resizeInputs[columnIndex].nativeElement, 'keydown', {
    keyboardEventInit: { key: 'ArrowRight' }
  });
  let newValue = Number(resizeInputs[columnIndex].nativeElement.value) + deltaX;
  resizeInputs[columnIndex].nativeElement.value = newValue;
  SkyAppTestUtility.fireDomEvent(resizeInputs[columnIndex].nativeElement, 'change', {});
}

function getTable(fixture: ComponentFixture<any>) {
  return fixture.debugElement.query(By.css('.sky-grid-table'));
}

function getTableRows(fixture: ComponentFixture<any>) {
  return fixture.debugElement.queryAll(By.css('tbody tr'));
}

function getTableWidth(fixture: ComponentFixture<any>) {
  const table = getTable(fixture);
  return table.nativeElement.offsetWidth;
}

function cloneItems(items: any[]): any[] {
  return JSON.parse(JSON.stringify(items));
}

function isWithin(actual: number, base: number, distance: number) {
  return Math.abs(actual - base) <= distance;
}

function verifyWidthsMatch(actual: number, expected: number) {
  expect(isWithin(actual, expected, 5)).toEqual(true);
}

function verifyAllWidthsMatch(actualWidths: number[], expectedWidths: number[]) {
  expect(actualWidths.length).toEqual(expectedWidths.length);
  for (let i = 0; i < actualWidths.length; i++) {
    expect(isWithin(actualWidths[i], expectedWidths[i], 1)).toEqual(true);
  }
}

function showColumn2(fixture: ComponentFixture<any>) {
  let button = fixture.debugElement.query(By.css('#show-column-button'));
  button.nativeElement.click();
}

function hideColumn2(fixture: ComponentFixture<any>) {
  let button = fixture.debugElement.query(By.css('#hide-column-button'));
  button.nativeElement.click();
}

const minColWidth = '50';
const maxColWidth = '9999';
//#endregion

describe('Grid Component', () => {
  describe('Basic fixture with undefined data', () => {
    let component: GridUndefinedTestComponent,
      fixture: ComponentFixture<GridUndefinedTestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });

      fixture = TestBed.createComponent(GridUndefinedTestComponent);
      component = fixture.componentInstance;
    }));

    it(`should be able to load with no exceptions`, () => {
      fixture.detectChanges();
      fixture.detectChanges();
      expect(component.grid.items).toBeUndefined();

      component.data = [
        { id: '1', column1: 'foo' }
      ];

      fixture.detectChanges();
      fixture.detectChanges();
      expect(component.grid.items).not.toBeUndefined();
    });
  });

  describe('Basic Fixture with fit=scroll', () => {
    let component: GridTestComponent,
      fixture: ComponentFixture<GridTestComponent>,
      nativeElement: HTMLElement,
      element: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(GridTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    });

    //#region helpers
    function verifyHeaders(useAllHeaders = false, hiddenCol = false) {
      let headerCount = useAllHeaders ? 7 : 5;
      if (hiddenCol) {
        headerCount = 6;
      }

      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(headerCount);
      expect(getColumnHeader('column1', element).nativeElement.textContent.trim()).toBe('Column1');
      expect(getColumnHeader('column2', element).nativeElement.textContent.trim()).toBe('Column2');
      expect(getColumnHeader('column3', element).nativeElement.textContent.trim()).toBe('Column3');

      if (!hiddenCol) {
        expect(getColumnHeader('column4', element).nativeElement.textContent.trim())
          .toBe('Column4');
      }

      expect(getColumnHeader('column5', element).nativeElement.textContent.trim()).toBe('Column5');

      if (useAllHeaders) {
        expect(getColumnHeader('hiddenCol1', element).nativeElement.textContent.trim())
          .toBe('Column6');
        expect(getColumnHeader('hiddenCol2', element).nativeElement.textContent.trim())
          .toBe('Column7');
      }
    }

    function verifyData(flatData = false, useAllHeaders = false, hiddenCol = false) {
      for (let i = 0; i < component.data.length; i++) {
        let row = component.data[i];

        expect(getCell(row.id, 'column1', element).nativeElement.textContent.trim())
          .toBe(row.column1);
        expect(getCell(row.id, 'column2', element).nativeElement.textContent.trim())
          .toBe(row.column2);
        expect(getCell(row.id, 'column3', element).nativeElement.textContent.trim())
          .toBe(row.column3.toString());
        expect(getCell(row.id, 'column3', element)
          .query(By.css('div.sky-test-custom-template'))).not.toBeNull();

        if (!hiddenCol) {
          expect(getCell(row.id, 'column4', element).nativeElement.textContent.trim())
            .toBe(row.column4.toString());
        }

        expect(getCell(row.id, 'column5', element).nativeElement.textContent.trim())
          .toBe(row.column5 || '');

        if (useAllHeaders) {
          expect(getCell(row.id, 'hiddenCol1', element).nativeElement.textContent)
            .toBe(row.column1);
          expect(getCell(row.id, 'hiddenCol2', element).nativeElement.textContent)
            .toBe(row.column1);
        }
      }
    }

    function verifyConsumerColumnWidthsAreMaintained() {
      for (let i = 0; i < component.grid.displayedColumns.length; i++) {
        let col = component.grid.displayedColumns[i];
        if (col.width) {
          let colEl = element.queryAll(By.css('thead th'))[i];
          verifyWidthsMatch(colEl.nativeElement.offsetWidth, col.width);
        }
      }
    }
    //#endregion

    describe('standard setup', () => {
      beforeEach(() => {
        fixture.detectChanges();
        fixture.detectChanges();
      });

      it('should show 5 columns', () => {
        verifyHeaders();
      });

      it('should show the table cells', () => {
        verifyData();
      });

      it('should transform data properly into a usable formate for the grid', () => {
        component.data = [
          {
            id: '1',
            column1: '1',
            column2: 'Apple',
            column3: 1,
            column4: moment().add(1, 'minute')
          },
          {
            id: '2',
            column1: '01',
            column2: 'Banana',
            column3: 1,
            column4: moment().add(6, 'minute'), column5: 'test'
          },
          {
            id: '3',
            column1: '11',
            column2: 'Carrot',
            column3: 11,
            column4: moment().add(4, 'minute')
          },
          {
            id: '4',
            column1: '12',
            column2: 'Daikon',
            column3: 12,
            column4: moment().add(2, 'minute')
          },
          {
            id: '5',
            column1: '13',
            column2: 'Edamame',
            column3: 13,
            column4: moment().add(5, 'minute')
          },
          {
            id: '6',
            column1: '20',
            column2: 'Fig',
            column3: 20,
            column4: moment().add(3, 'minute')
          },
          {
            id: '7',
            column1: '21',
            column2: 'Grape',
            column3: 21,
            column4: moment().add(7, 'minute')
          }
        ];

        fixture.detectChanges();
        fixture.detectChanges();

        verifyData(true);

      });

      it('should change displayed headers and data when selected columnids change and emit the change event', async(() => {
        component.grid.selectedColumnIdsChange.subscribe((newSelectedColumnIds: string[]) => {
          expect(newSelectedColumnIds).toEqual([
            'column1',
            'column2',
            'column3',
            'column4',
            'column5',
            'hiddenCol1',
            'hiddenCol2'
          ]);
        });

        component.selectedColumnIds = [
          'column1',
          'column2',
          'column3',
          'column4',
          'column5',
          'hiddenCol1',
          'hiddenCol2'
        ];
        fixture.detectChanges();

        verifyHeaders(true);
        verifyData(false, true);
      }));

      it('should show all columns when selectedColumnIds is undefined', () => {
        component.selectedColumnIds = undefined;

        fixture.detectChanges();

        verifyHeaders(true);
        verifyData(false, true);
      });

      it('should change styles based on hasToolbar input', () => {
        const table = getTable(fixture).nativeElement;
        expect(table).not.toHaveCssClass('sky-grid-fit');
        expect(table).not.toHaveCssClass('sky-grid-has-toolbar');
        component.hasToolbar = true;
        fixture.detectChanges();
        expect(table).toHaveCssClass('sky-grid-has-toolbar');
      });

      it('should allow the access of search function on displayed columns', () => {
        let searchFunctions = component.grid.displayedColumns.map(column => {
          return column.searchFunction;
        });

        expect(searchFunctions.length).toBe(5);
        for (let i = 0; i < searchFunctions.length; i++) {
          let result = searchFunctions[i]('Something', 'something');
          expect(result).toBe(true);
        }

        expect(component.searchText).toBe('something');
        expect(component.searchedData).toBe('Something');

        component.searchText = '';
        component.searchedData = '';

        for (let i = 0; i < searchFunctions.length; i++) {
          let result = searchFunctions[i]('blaah', 'something');
          if (component.searchText !== '') {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
          component.searchText = '';
          component.searchedData = '';

        }

        for (let i = 0; i < searchFunctions.length; i++) {
          let result = searchFunctions[i](undefined, 'something');
          if (component.searchText !== '') {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
          component.searchText = '';
          component.searchedData = '';
        }
      });

      it('should maintain column width when provided by consumer', () => {
        verifyConsumerColumnWidthsAreMaintained();
      });

      it('should highlight rows when rowHighlightedId is defined', () => {
        const tableRows = getTableRows(fixture);

        // Start with no class.
        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-row-highlight');

        component.rowHighlightedId = '1';
        fixture.detectChanges();

        // Row should now have the highlight class.
        expect(tableRows[0].nativeElement).toHaveCssClass('sky-grid-row-highlight');

        component.rowHighlightedId = undefined;
        fixture.detectChanges();

        // Row should NOT have the highlight class.
        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-row-highlight');
      });

      it('should pass accessibility', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));

      describe('sorting', () => {
        it('adds appropriate icons and styles, and emits event on click to headers', () => {
          let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          let skyIcon = headerEl.querySelector('sky-icon') as HTMLElement;
          expect(skyIcon.style.visibility).toBe('hidden');
          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: true });
          expect(headerEl.querySelector('i')).toHaveCssClass('fa-caret-down');
          expect(skyIcon.style.visibility).toBe('visible');

          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: false });
          expect(headerEl.querySelector('i')).toHaveCssClass('fa-caret-up');
          expect(skyIcon.style.visibility).toBe('visible');
        });

        it('should not respond to click when the appropriate column option is set', () => {
          let headerEl = nativeElement.querySelectorAll('th').item(1) as HTMLElement;
          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(1) as HTMLElement;
          expect(component.activeSortSelector)
            .toEqual(undefined);
          expect(headerEl.querySelector('i')).toBeNull();
        });

        it('responds to sort selector input change', () => {
          component.sortField = {
            fieldSelector: 'column1',
            descending: false
          };
          fixture.detectChanges();

          let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;

          expect(headerEl.querySelector('i')).toHaveCssClass('fa-caret-up');
        });

        it('should have proper aria-sort labels', async(() => {
          let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(headerEl.getAttribute('aria-sort')).toBe('descending');

          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(headerEl.getAttribute('aria-sort')).toBe('ascending');

          let noSortHeaderEl = nativeElement.querySelectorAll('th').item(1) as HTMLElement;
          expect(noSortHeaderEl.getAttribute('aria-sort')).toBeNull();

          let unSortedHeaderEl = nativeElement.querySelectorAll('th').item(2) as HTMLElement;
          expect(unSortedHeaderEl.getAttribute('aria-sort')).toBe('none');

          // Run accessibility test.
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
          });
        }));

        it('should sort on enter or space press', () => {
          let headerEl = element.query(By.css('th[sky-cmp-id="column1"]'));
          headerEl.triggerEventHandler('keydown', { key: 'Enter' });
          fixture.detectChanges();

          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: true });
          expect(headerEl.nativeElement.querySelector('i')).toHaveCssClass('fa-caret-down');

          headerEl.triggerEventHandler('keydown', { key: ' ' });
          fixture.detectChanges();

          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: false });
          expect(headerEl.nativeElement.querySelector('i')).toHaveCssClass('fa-caret-up');
        });
      });

      describe('Models and State', () => {

        it('should construct ListViewGridColumnModel without data', () => {
          let model = new SkyGridColumnModel(component.viewtemplates.first);
          expect(model.template).not.toBeUndefined();
          expect(model.field).toBeUndefined();
          expect(model.heading).toBeUndefined();
          expect(model.id).toBeUndefined();
          expect(model.locked).toBeUndefined();
          expect(model.hidden).toBeUndefined();
          expect(model.type).toBeUndefined();
          expect(model.width).toBeUndefined();
        });
      });

      describe('Resizeable columns', () => {

        it('should not resize if user does not use resize handle', fakeAsync(() => {
          // Get initial baseline for comparison.
          let initialTableWidth = getTableWidth(fixture);
          let initialColumnWidths = getColumnWidths(fixture);

          // Move the mouse.
          SkyAppTestUtility.fireDomEvent(document, 'mousemove');

          // Assert nothing was changed.
          let newTableWidth = getTableWidth(fixture);
          let newColumnWidths = getColumnWidths(fixture);
          verifyWidthsMatch(initialTableWidth, newTableWidth);
          verifyAllWidthsMatch(initialColumnWidths, newColumnWidths);
          expect(component.columnWidthsChange).toBeUndefined();
        }));

        it('should prevent users from resizing column smaller than the minimum limit', fakeAsync(() => {
          // Get initial baseline for comparison.
          let initialTableWidth = getTableWidth(fixture);
          let initialColumnWidths = getColumnWidths(fixture);

          // The last column is already 50px wide. Try to make it smaler...
          resizeColumn(fixture, -50, 4);

          // Assert nothing was changed.
          let newTableWidth = getTableWidth(fixture);
          let newColumnWidths = getColumnWidths(fixture);

          verifyWidthsMatch(initialTableWidth, newTableWidth);
          verifyAllWidthsMatch(initialColumnWidths, newColumnWidths);
        }));

        it('should properly resize column and emit change event on release of resize handle', fakeAsync(() => {
          // Get initial baseline for comparison.
          let initialTableWidth = getTableWidth(fixture);
          let initialColumnWidths = getColumnWidths(fixture);

          // Resize first column.
          let resizeXDistance = 50;
          resizeColumn(fixture, resizeXDistance, 0);

          // Assert table was resized properly.
          let newTableWidth = getTableWidth(fixture);
          let newColumnWidths = getColumnWidths(fixture);
          let expectedColumnWidths = Object.assign(initialColumnWidths);
          expectedColumnWidths[0] = initialColumnWidths[0] + resizeXDistance;
          verifyWidthsMatch(initialTableWidth + resizeXDistance, newTableWidth);
          verifyAllWidthsMatch(expectedColumnWidths, newColumnWidths);
          component.columnWidthsChange.forEach((cwc, index) => {
            if (cwc.id.indexOf('hidden') === -1) {
              verifyWidthsMatch(cwc.width, expectedColumnWidths[index]);
            }
          });
        }));

        it('should have correct aria-labels on resizing range input', fakeAsync(() => {
          const resizeInputs = getColumnRangeInputs(fixture);
          let colWidths = getColumnWidths(fixture);
          resizeInputs.forEach((resizeInput, index) => {
            expect(resizeInput.nativeElement.getAttribute('aria-controls')).not.toBeNull();
            expect(resizeInput.nativeElement.getAttribute('aria-valuemax')).toBe(maxColWidth);
            expect(resizeInput.nativeElement.getAttribute('aria-valuemin')).toBe(minColWidth);
            expect(resizeInput.nativeElement.getAttribute('max')).toBe(maxColWidth);
            expect(resizeInput.nativeElement.getAttribute('min')).toBe(minColWidth);
          });

          // Increase first column.
          resizeColumnByRangeInput(fixture, 0, 10);
          fixture.detectChanges();
          colWidths = getColumnWidths(fixture);

          // Expect valuenow to be updated with new width values.
          resizeInputs.forEach((resizeInput, index) => {
            let valuenow = resizeInput.nativeElement.getAttribute('aria-valuenow');
            verifyWidthsMatch(valuenow, colWidths[index]);
          });
        }));

        it('should resize column when range input is changed', async(() => {
          // Get initial baseline for comparison.
          // Note: We are assuming column at index[1] starts with a set value (150).
          let columnIndex = 1;
          let initialTableWidth = getTableWidth(fixture);
          let initialColumnWidths = getColumnWidths(fixture);
          let inputRange = getColumnRangeInputs(fixture)[1];
          let deltaX = 10;

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            // Increase first column.
            resizeColumnByRangeInput(fixture, columnIndex, deltaX);

            // Assert table was resized properly, and input range was updated correctly.
            let expectedColumnWidths: any = cloneItems(initialColumnWidths);
            expectedColumnWidths[columnIndex] = expectedColumnWidths[columnIndex] + deltaX;

            verifyWidthsMatch(getTableWidth(fixture), initialTableWidth + deltaX);
            verifyAllWidthsMatch(getColumnWidths(fixture), expectedColumnWidths);
            verifyWidthsMatch(Number(inputRange.nativeElement.value), initialColumnWidths[columnIndex] + deltaX);
            component.columnWidthsChange.forEach((cwc, index) => {
              if (cwc.id.indexOf('hidden') === -1) {
                verifyWidthsMatch(cwc.width, expectedColumnWidths[index]);
              }
            });

            // Decrease first column.
            initialTableWidth = getTableWidth(fixture);
            initialColumnWidths = getColumnWidths(fixture);
            deltaX = -20;
            resizeColumnByRangeInput(fixture, columnIndex, deltaX);

            // Assert table was resized properly, and input range was updated correctly.
            expectedColumnWidths = cloneItems(initialColumnWidths);
            expectedColumnWidths[columnIndex] = expectedColumnWidths[columnIndex] + deltaX;
            verifyWidthsMatch(getTableWidth(fixture), initialTableWidth + deltaX);
            verifyAllWidthsMatch(getColumnWidths(fixture), expectedColumnWidths);
            verifyWidthsMatch(Number(inputRange.nativeElement.value), initialColumnWidths[columnIndex] + deltaX);
            component.columnWidthsChange.forEach((cwc, index) => {
              if (cwc.id.indexOf('hidden') === -1) {
                verifyWidthsMatch(cwc.width, expectedColumnWidths[index]);
              }
            });

            // Run accessibility test.
            fixture.whenStable().then(() => {
              expect(fixture.nativeElement).toBeAccessible();
            });
          });
        }));

        it('should NOT change max value when column width is changed', fakeAsync(() => {
          // Get initial baseline for comparison.
          let initialMaxValues = getColumnResizeInputMaxValues(fixture);

          // Resize first column.
          resizeColumnByRangeInput(fixture, 0, 50);

          // Assert max value on input ranges was not changed.
          let expectedColumnInputs = getColumnResizeInputMaxValues(fixture);
          expect(initialMaxValues).toEqual(expectedColumnInputs);
        }));

        it('should reset table width when columns are hidden/shown', fakeAsync(() => {
          // Get initial baseline for comparison.
          let initialTableWidth = getTableWidth(fixture);

          // Resize first column.
          let resizeXDistance = 50;
          resizeColumn(fixture, resizeXDistance, 0);

          // Hide column 2.
          hideColumn2(fixture);
          fixture.detectChanges();
          tick();

          // Assert table width should be 50 additional pixels for resize of col2,
          // and less 150 for the hidden column.
          let newTableWidth = getTableWidth(fixture);
          let expectedTableWidth = initialTableWidth + 50 - 150;
          verifyWidthsMatch(expectedTableWidth, newTableWidth);

          // Show column 2.
          showColumn2(fixture);
          fixture.detectChanges();
          tick();

          // Now that we've put col2 back, assert table width
          // should be 50 additional pixels for resize of col2
          newTableWidth = getTableWidth(fixture);
          expectedTableWidth = initialTableWidth + 50;
          verifyWidthsMatch(expectedTableWidth, newTableWidth);
        }));

        it('should properly emit column widths even when columns are hidden', fakeAsync(() => {
          // Hide column 2.
          hideColumn2(fixture);
          fixture.detectChanges();
          tick();

          // Resize first column.
          let resizeXDistance = 50;
          resizeColumn(fixture, resizeXDistance, 0);

          // Expect hidden column to be in emitted array.
          let column2 = component.columnWidthsChange.find(cwc => cwc.id === 'column2');
          expect(column2).not.toBeNull();
        }));
      });
    });

    describe('selectedColumnIds undefined on load', () => {
      beforeEach(() => {
        component.selectedColumnIds = undefined;
        fixture.detectChanges();
        fixture.detectChanges();
      });

      it(
        'should hide columns based on the hidden property on initialization',
        () => {
          verifyHeaders(true, true);
          verifyData(false, true, true);
        });
    });

    describe('strange data', () => {
      beforeEach(() => {
        fixture.detectChanges();
        fixture.detectChanges();
      });

      it('should return undefined when shape of data is bad', () => {
        component.data = [
          {

          },
          {

          }
        ];
        fixture.detectChanges();
      });
    });
  });

  describe('Basic Fixture with fit=width', () => {
    let fixture: ComponentFixture<GridTestComponent>,
      component: GridTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(GridTestComponent);
      component = fixture.componentInstance;
      component.fitType = 'width';
      fixture.detectChanges();
      fixture.detectChanges();
    });

    describe('Standard setup', () => {
      it('should change styles based on hasToolbar input', () => {
        const table = getTable(fixture).nativeElement;
        expect(table).toHaveCssClass('sky-grid-fit');
        expect(table).not.toHaveCssClass('sky-grid-has-toolbar');
        component.hasToolbar = true;
        fixture.detectChanges();
        expect(table).toHaveCssClass('sky-grid-has-toolbar');
      });

      it('should pass accessibility', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));
    });

    describe('Resiazable columns', () => {

      it('should not allow resizing when the final column is at the minimum width', fakeAsync(() => {
        // Get initial baseline for comparison.
        let initialTableWidth = getTableWidth(fixture);
        let initialColumnWidths = getColumnWidths(fixture);

        // Resize first column.
        let resizeXDistance = 50;
        resizeColumn(fixture, resizeXDistance, 0);

        // Assert table width did not change, and only first and last column were resized.
        let newTableWidth = getTableWidth(fixture);
        let newColumnWidths = getColumnWidths(fixture);

        verifyWidthsMatch(newTableWidth, initialTableWidth);
        verifyAllWidthsMatch(newColumnWidths, initialColumnWidths);
      }));

      it('should resize columns on mousemove', fakeAsync(() => {
        const spy = spyOn(fixture.componentInstance.grid, 'onMouseMove').and.callThrough();
        // Get initial baseline for comparison.
        let initialTableWidth = getTableWidth(fixture);
        let initialColumnWidths = getColumnWidths(fixture);

        // Resize last column so its larger than the min-width.
        // We have to do this, because fit=width doesn't allow the last column to be smaller than min.
        let resizeXDistance = 50;
        resizeColumn(fixture, -resizeXDistance, 2);

        // Resize first column.
        resizeColumn(fixture, resizeXDistance, 0);

        // Assert table width did not change, and only first and last column were resized.
        let newTableWidth = getTableWidth(fixture);
        let newColumnWidths = getColumnWidths(fixture);
        let expectedColumnWidths = Object.assign(initialColumnWidths);
        expectedColumnWidths[0] = expectedColumnWidths[0] + resizeXDistance;
        expectedColumnWidths[2] = expectedColumnWidths[2] - resizeXDistance;
        expectedColumnWidths[4] = 50;
        verifyWidthsMatch(newTableWidth, initialTableWidth);
        verifyAllWidthsMatch(newColumnWidths, expectedColumnWidths);
        expect(spy).toHaveBeenCalled();
      }));

      it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
        const spy = spyOn(fixture.componentInstance.grid, 'onMouseMove').and.callThrough();
        // Get initial baseline for comparison.
        let initialTableWidth = getTableWidth(fixture);
        let initialColumnWidths = getColumnWidths(fixture);

        let evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('mousemove', false, false, window, 0, 0, 0, 70,
          0, false, false, false, false, 0, undefined);

        // Assert table width did not change, and only first and last column were resized.
        let newTableWidth = getTableWidth(fixture);
        let newColumnWidths = getColumnWidths(fixture);
        verifyWidthsMatch(newTableWidth, initialTableWidth);
        verifyAllWidthsMatch(newColumnWidths, initialColumnWidths);
        expect(spy).not.toHaveBeenCalled();
      }));

      it('should change max value when column width is changed', fakeAsync(() => {
        // Get initial baseline for comparison.
        let initialMaxValues = getColumnResizeInputMaxValues(fixture);

        // Squeeze a column so it adds more width to the last column.
        // We have to do this, because fit=width doesn't allow the last column to be smaller than min.
        let deltaX = 50;
        resizeColumnByRangeInput(fixture, 2, -deltaX);

        // Resize first column.
        resizeColumnByRangeInput(fixture, 0, deltaX);

        // Assert max value on input ranges were properly updated.
        let expectedColumnInputs = getColumnResizeInputMaxValues(fixture);
        expect(initialMaxValues).not.toEqual(expectedColumnInputs);
      }));
    });
  });

  describe('multiselect', () => {
    let fixture: ComponentFixture<GridTestComponent>,
      component: GridTestComponent,
      element: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });
    });
    beforeEach(() => {
      fixture = TestBed.createComponent(GridTestComponent);
      component = fixture.componentInstance;
      element = fixture.debugElement as DebugElement;
      component.enableMultiselect = true;
      component.multiselectRowId = 'id';
      fixture.detectChanges();
      fixture.detectChanges();
    });
    function getMultiselectInputs() {
      return fixture.debugElement.queryAll(By.css('tbody .sky-grid-multiselect-cell input'));
    }
    describe('Standard setup', () => {
      it('should add checkboxes properly to grid, with proper accessibility attributes', () => {
        const checkboxes = getMultiselectInputs();

        expect(checkboxes).not.toBeNull();
        expect(checkboxes.length).toEqual(component.data.length);
        checkboxes.forEach(checkbox => {
          expect(checkbox.nativeElement.getAttribute('aria-label')).not.toBeNull();
        });
      });

      it('should set the multiselect column to the minimum width', () => {
        let headerEl = fixture.nativeElement.querySelector('th.sky-grid-multiselect-cell') as HTMLElement;

        verifyWidthsMatch(headerEl.offsetWidth, parseInt(minColWidth, 10));
      });

      it('should not show multiselect features if enableMultiselect is false', () => {
        fixture = TestBed.createComponent(GridTestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement as DebugElement;
        component.enableMultiselect = false;
        fixture.detectChanges();
        fixture.detectChanges();

        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        expect(checkboxes.length).toEqual(0);
        tableRows.forEach(row => {
          expect(row.nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
        });
      });

      it('should not show multiselect features if enableMultiselect is undefined', () => {
        fixture = TestBed.createComponent(GridTestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement as DebugElement;
        component.enableMultiselect = undefined;
        fixture.detectChanges();
        fixture.detectChanges();

        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        expect(checkboxes.length).toEqual(0);
        tableRows.forEach(row => {
          expect(row.nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
        });
      });

      it('should toggle selected classes properly when checked', () => {
        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        // Start with no class.
        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');

        // Check to add class.
        checkboxes[0].nativeElement.click();
        fixture.detectChanges();

        expect(tableRows[0].nativeElement).toHaveCssClass('sky-grid-multiselect-selected-row');

        // Uncheck to remove class.
        checkboxes[0].nativeElement.click();
        fixture.detectChanges();

        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
      });

      it('should select checkbox when clicking on row', async(() => {
        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        // Start unchecked.
        expect(checkboxes[0].nativeElement.checked).toBe(false);

        // Click on first row.
        tableRows[0].nativeElement.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          // Expect first row to have class.
          expect(checkboxes[0].nativeElement.checked).toBe(true);
          expect(tableRows[0].nativeElement).toHaveCssClass('sky-grid-multiselect-selected-row');

          // Uncheck to remove class.
          tableRows[0].nativeElement.click();
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            fixture.detectChanges();

            // Expect class to be removed and checkbox to be unchecked.
            expect(checkboxes[0].nativeElement.checked).toBe(false);
            expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
          });
        });
      }));

      it('should emit a change when checkboxes are checked', fakeAsync(() => {
        const inputs = getMultiselectInputs();

        // Nothing should have been emitted yet.
        expect(component.selectedRowsChange).toBeUndefined();

        // Check 1,2,5.
        inputs[0].nativeElement.click();
        inputs[1].nativeElement.click();
        inputs[4].nativeElement.click();
        fixture.detectChanges();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, 'id'.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['1', '2', '5']
        };
        expect(component.selectedRowsChange).toEqual(expectedRows);
      }));

      it('should emit a change when clicking on row', async(() => {
        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        // Start unchecked.
        expect(checkboxes[0].nativeElement.checked).toBe(false);

        // Click on a few rows.
        tableRows[0].nativeElement.click();
        tableRows[1].nativeElement.click();
        tableRows[4].nativeElement.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          // Expect the emitter to send us 1,2,5.
          // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
          // In this example, 'id'.
          let expectedRows: SkyGridSelectedRowsModelChange = {
            selectedRowIds: ['1', '2', '5']
          };
          expect(component.selectedRowsChange).toEqual(expectedRows);
        });
      }));

      it('should emit a change when checkboxes are checked, based on a custom multiselectRowId', fakeAsync(() => {
        fixture = TestBed.createComponent(GridTestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement as DebugElement;
        component.multiselectRowId = 'customId';
        component.enableMultiselect = true;
        fixture.detectChanges();
        fixture.detectChanges();

        const inputs = getMultiselectInputs();

        // Nothing should have been emitted yet.
        expect(component.selectedRowsChange).toBeUndefined();

        // Check 1,2,5.
        inputs[0].nativeElement.click();
        inputs[1].nativeElement.click();
        inputs[4].nativeElement.click();
        fixture.detectChanges();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, 'customId'.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['101', '102', '105']
        };
        expect(component.selectedRowsChange).toEqual(expectedRows);
      }));

      it('should fall back to id property when multiselectRowId property doesnt exist', fakeAsync(() => {
        fixture = TestBed.createComponent(GridTestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement as DebugElement;
        component.multiselectRowId = 'foobar';
        component.enableMultiselect = true;
        fixture.detectChanges();
        fixture.detectChanges();

        const inputs = getMultiselectInputs();

        // Nothing should have been emitted yet.
        expect(component.selectedRowsChange).toBeUndefined();

        // Check 1,2,5.
        inputs[0].nativeElement.click();
        inputs[1].nativeElement.click();
        inputs[4].nativeElement.click();
        fixture.detectChanges();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, there is no match so it should fall back to the 'id' property.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['1', '2', '5']
        };
        expect(component.selectedRowsChange).toEqual(expectedRows);
      }));

      it('should retain checked items when sorting', () => {
        const inputs = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        // Nothing should have been emitted yet.
        expect(component.selectedRowsChange).toBeUndefined();

        // Check 1,2,5.
        inputs[0].nativeElement.click();
        inputs[1].nativeElement.click();
        inputs[4].nativeElement.click();
        fixture.detectChanges();

        // Sort by one of the columns.
        const tableHeader = getColumnHeader('column1', element);
        tableHeader.nativeElement.click();
        fixture.detectChanges();

        // Expect only the above 3 rows are checked.
        tableRows.forEach(row => {
          let id = row.nativeElement.getAttribute('sky-cmp-id');
          if (id === '1' || id === '2' || id === '5') {
            expect(row.query(By.css('input')).nativeElement.checked).toBe(true);
          } else {
            expect(row.query(By.css('input')).nativeElement.checked).toBe(false);
          }
        });
      });

      it('should not be sortable when clicking on multiselect column', () => {
        let sortSpy = spyOn(component, 'onSort');
        let headerEl = fixture.nativeElement.querySelector('th.sky-grid-multiselect-cell') as HTMLElement;
        SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
          { bubbles: false, cancelable: false });
        fixture.detectChanges();

        expect(sortSpy).not.toHaveBeenCalled();
      });

      it('should properly update isSelected when message stream is used for ClearAll/SelectAll', () => {
        const checkboxes = getMultiselectInputs();
        const tableRows = getTableRows(fixture);

        // Start with no class.
        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');

        // Select all.
        const selectAllMessage: SkyGridMessage = { type: SkyGridMessageType.SelectAll };
        fixture.componentInstance.gridController.next(selectAllMessage);
        fixture.detectChanges();

        for (let i = 0; i < checkboxes.length; i++) {
          expect(component.data[i].isSelected = true);
          expect(checkboxes[i].nativeElement.checked = true);
          expect(tableRows[i].nativeElement).toHaveCssClass('sky-grid-multiselect-selected-row');
        }

        const clearAllMessage: SkyGridMessage = { type: SkyGridMessageType.ClearAll };
        fixture.componentInstance.gridController.next(clearAllMessage);
        fixture.detectChanges();

        for (let i = 0; i < checkboxes.length; i++) {
          expect(component.data[i].isSelected = false);
          expect(checkboxes[i].nativeElement.checked = false);
          expect(tableRows[i].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
        }
      });

      it('should be accessible', async(() => {
        const inputs = getMultiselectInputs();

        // Run accessibility test.
        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();

          // Click on first row.
          inputs[0].nativeElement.click();
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement).toBeAccessible();
          });
        });
      }));
    });
  });

  describe('multiselect with interactive elements', () => {
    let fixture: ComponentFixture<GridInteractiveTestComponent>,
      component: GridInteractiveTestComponent,
      element: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });
    });
    beforeEach(() => {
      fixture = TestBed.createComponent(GridInteractiveTestComponent);
      component = fixture.componentInstance;
      element = fixture.debugElement as DebugElement;
      component.enableMultiselect = true;
      component.multiselectRowId = 'id';
      fixture.detectChanges();
      fixture.detectChanges();
    });

    function getMultiselectInputs() {
      return fixture.debugElement.queryAll(By.css('tbody .sky-grid-multiselect-cell input'));
    }

    function getButtons() {
      return fixture.debugElement.queryAll(By.css('tbody td button'));
    }

    it('should not check checkbox when clicking on an interactive element in the row', async(() => {
      const checkboxes = getMultiselectInputs();
      const tableRows = getTableRows(fixture);
      const buttons = getButtons();

      // Click on buttons.
      buttons[0].nativeElement.click();
      buttons[1].nativeElement.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        // Expect nothing to be checked or emitted.
        expect(checkboxes[0].nativeElement.checked).toBe(false);
        expect(tableRows[0].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
        expect(checkboxes[1].nativeElement.checked).toBe(false);
        expect(tableRows[1].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
        expect(component.selectedRowsChange).toEqual(undefined);
      });
    }));
  });

  describe('dragula functionality', () => {
    let mockDragulaService: DragulaService;
    let component: GridTestComponent,
      fixture: ComponentFixture<GridTestComponent>,
      element: DebugElement;

    beforeEach(() => {
      mockDragulaService = new MockDragulaService();

      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });

      fixture = TestBed.overrideComponent(SkyGridComponent, {
        add: {
          viewProviders: [
            {
              provide: DragulaService,
              useValue: mockDragulaService
            }
          ]
        }
      }).createComponent(GridTestComponent);

      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    });

    it('should add the dragging class to the header on dragula drag', fakeAsync(() => {
      fixture.detectChanges();
      fixture.detectChanges();

      let addCalled: boolean;

      mockDragulaService.drag.emit([
        undefined,
        {
          classList: {
            add(cls: string) {
              addCalled = true;
              expect(cls).toBe('sky-grid-header-dragging');
            }
          }
        }
      ]);

      tick();
      fixture.detectChanges();
      expect(addCalled).toBe(true);
    }));

    it('should remove the dragging class to the header of dragula draggend', fakeAsync(() => {
      fixture.detectChanges();
      fixture.detectChanges();

      let removeCalled: boolean;

      mockDragulaService.dragend.emit([
        undefined,
        {
          classList: {
            remove(cls: string) {
              removeCalled = true;
              expect(cls).toBe('sky-grid-header-dragging');
            }
          }
        }
      ]);

      tick();
      fixture.detectChanges();
      expect(removeCalled).toBe(true);
    }));

    it('should set selectedColumnIds to the new column order on drop and update headers and data',
      fakeAsync(() => {
        let newSelectedColumnIds: string[];
        let expectedColumnIds = [
          'column2',
          'column1',
          'column3',
          'column4',
          'column5'
        ];

        fixture.detectChanges();
        fixture.detectChanges();

        component.grid.selectedColumnIdsChange.subscribe(() => {
          newSelectedColumnIds = [
            'column2',
            'column1',
            'column3',
            'column4',
            'column5'
          ];
        });

        mockDragulaService.drop.emit([
          undefined,
          undefined,
          {
            querySelectorAll(elementSelector: string) {
              expect(elementSelector).toBe('th:not(.sky-grid-multiselect-cell)');
              return [
                {
                  getAttribute(idSelector: string) {
                    expect(idSelector).toBe('sky-cmp-id');
                    return 'column2';
                  }
                },
                {
                  getAttribute(idSelector: string) {
                    return 'column1';
                  }
                },
                {
                  getAttribute(idSelector: string) {
                    return 'column3';
                  }
                },
                {
                  getAttribute(idSelector: string) {
                    return 'column4';
                  }
                },
                {
                  getAttribute(idSelector: string) {
                    return 'column5';
                  }
                }
              ];
            }
          }
        ]);
        tick();
        fixture.detectChanges();

        expect(newSelectedColumnIds).toEqual(expectedColumnIds);
        expect(component.grid.selectedColumnIds).toEqual(expectedColumnIds);

        const headerAttribute = element.nativeElement
          .getElementsByTagName('th')[0].getAttribute('sky-cmp-id');

        expect(headerAttribute).toBe('column2');

        const cellAttribute = element.nativeElement
          .getElementsByTagName('sky-grid-cell')[0].getAttribute('sky-cmp-id');

        expect(cellAttribute).toBe('column2');
      })
    );

    it('should set dragula options for locked and resizable columns', () => {
      const setOptionsSpy = spyOn(mockDragulaService, 'setOptions').and
        .callFake((bagId: any, options: any) => {
          const moveOption = options.moves(
            undefined,
            undefined,
            {
              matches(selector: string) {
                return (selector === '.sky-grid-header-locked');
              }
            }
          );

          const moveOptionFromResize = options.moves(
            undefined,
            undefined,
            {
              matches(selector: string) {
                return (selector === '.sky-grid-resize-handle');
              }
            }
          );

          const moveOptionUndefined = options.moves(
            undefined,
            undefined,
            undefined
          );

          const acceptsOption = options.accepts(
            undefined,
            undefined,
            undefined,
            {
              matches(selector: string) {
                return (selector === '.sky-grid-header-locked');
              }
            }
          );

          expect(moveOption).toBe(false);
          expect(moveOptionFromResize).toBe(false);
          expect(moveOptionUndefined).toBe(false);
          expect(acceptsOption).toBe(false);
        });

      fixture.detectChanges();
      fixture.detectChanges();
      expect(setOptionsSpy).toHaveBeenCalled();
    });

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.detectChanges();

      let addCalled: boolean;

      mockDragulaService.drag.emit([
        undefined,
        {
          classList: {
            add(cls: string) {
              addCalled = true;
              expect(cls).toBe('sky-grid-header-dragging');
            }
          }
        }
      ]);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('Empty Fixture', () => {
    let fixture: ComponentFixture<GridEmptyTestComponent>,
      element: DebugElement,
      component: GridEmptyTestComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(GridEmptyTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    });

    function verifyHeaders(hideColumn = false) {
      const headerCount = hideColumn ? 1 : 2;

      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(headerCount);
      expect(getColumnHeader('column1', element).nativeElement.textContent.trim()).toBe('Column 1');

      if (!hideColumn) {
        expect(getColumnHeader('column2', element).nativeElement.textContent.trim())
          .toBe('Column 2');
      }
    }

    function verifyData(hideColumn = false) {
      for (let i = 0; i < component.data.length; i++) {
        const row = component.data[i];

        expect(getCell(row.id, 'column1', element).nativeElement.textContent.trim())
          .toBe(row.column1);

        if (hideColumn) {
          expect(getCell(row.id, 'column2', element)).toBeNull();
        } else {
          expect(getCell(row.id, 'column2', element).nativeElement.textContent.trim())
            .toBe(row.column2);
        }
      }
    }

    it('should be able to set columns without using sky-grid-column component', () => {
      fixture.detectChanges();
      component.columns = [
        new SkyGridColumnModel(component.template, {
          id: 'column1',
          heading: 'Column 1'
        }),
        new SkyGridColumnModel(component.template, {
          id: 'column2',
          heading: 'Column 2'
        })
      ];

      fixture.detectChanges();

      verifyHeaders();
      verifyData();
    });

    it('should hide columns based on the hidden property when columns property changed', () => {
      fixture.detectChanges();
      component.columns = [
        new SkyGridColumnModel(component.template, {
          id: 'column1',
          heading: 'Column 1'
        }),
        new SkyGridColumnModel(component.template, {
          id: 'column2',
          heading: 'Column 2',
          hidden: true
        })
      ];

      fixture.detectChanges();
      verifyHeaders(true);
      verifyData(true);
    });
  });

  describe('Dynamic columns', () => {
    it('should handle columns changing after initialization', () => {
      let component: GridDynamicTestComponent,
        fixture: ComponentFixture<GridDynamicTestComponent>,
        element: DebugElement;

      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });

      fixture = TestBed.createComponent(GridDynamicTestComponent);
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(getColumnHeader('name', element).nativeElement.textContent.trim())
        .toBe('Name Initial');
      expect(getColumnHeader('email', element).nativeElement.textContent.trim())
        .toBe('Email Initial');

      component.changeColumns();
      fixture.detectChanges();

      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(getColumnHeader('name', element).nativeElement.textContent.trim())
        .toBe('Name');
      expect(getColumnHeader('email', element).nativeElement.textContent.trim())
        .toBe('Email');
    });
  });

  describe('async headings and descriptions', () => {
    let fixture: ComponentFixture<GridAsyncTestComponent>;
    let element: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(GridAsyncTestComponent);
      element = fixture.debugElement as DebugElement;
    });

    function verifyColumnHeaders(id: string) {
      expect(getColumnHeader(id, element).nativeElement.textContent.trim()).toBe('');

      tick(110); // wait for setTimeout
      fixture.detectChanges();
      tick();

      expect(getColumnHeader(id, element).nativeElement.textContent.trim()).toBe('Column1');
    }

    it('should handle async column headings', fakeAsync(() => {
      fixture.detectChanges();
      verifyColumnHeaders('column1');
    }));

    it('should handle async column descriptions', fakeAsync(() => {
      fixture.detectChanges();

      let col1 = fixture.componentInstance.grid.columns.find(col => col.id === 'column1');
      expect(col1.description).toBe('');

      tick(110); // wait for setTimeout
      fixture.detectChanges();
      tick();

      expect(col1.description).toBe('Column1 Description');
    }));

    it('should support the item `field` property if `id` not provided', fakeAsync(() => {
      fixture.detectChanges();

      verifyColumnHeaders('column2');
    }));
  });

  describe('UI config', () => {
    let fixture: ComponentFixture<GridEmptyTestComponent>;
    let component: GridEmptyTestComponent;
    let uiConfigService: SkyUIConfigService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });

      fixture = TestBed.createComponent(GridEmptyTestComponent);
      component = fixture.componentInstance;
      uiConfigService = TestBed.get(SkyUIConfigService);
    });

    it('should call the UI config service when selected columns change', () => {
      component.columns = [
        new SkyGridColumnModel(component.template, {
          id: 'column1',
          heading: 'Column 1'
        }),
        new SkyGridColumnModel(component.template, {
          id: 'column2',
          heading: 'Column 2'
        })
      ];

      fixture.detectChanges();

      const spy = spyOn(uiConfigService, 'setConfig').and.callThrough();

      component.settingsKey = 'foobar';
      fixture.detectChanges();
      component.selectedColumnIds = ['column1', 'column2'];
      fixture.detectChanges();

      expect(spy.calls.count()).toEqual(1);

      spy.calls.reset();
      component.selectedColumnIds = ['column2', 'column1'];
      fixture.detectChanges();

      expect(spy.calls.count()).toEqual(1);
    });

    it('should fetch UI config on init', () => {
      const spy = spyOn(uiConfigService, 'getConfig').and.callThrough();

      component.settingsKey = 'foobar';
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('foobar');
    });

    it('should handle errors when setting config', () => {
      const spy = spyOn(console, 'warn');

      spyOn(uiConfigService, 'setConfig').and.callFake(() => {
        return Observable.throw(new Error());
      });

      component.columns = [
        new SkyGridColumnModel(component.template, {
          id: 'column1',
          heading: 'Column 1'
        }),
        new SkyGridColumnModel(component.template, {
          id: 'column2',
          heading: 'Column 2'
        })
      ];

      fixture.detectChanges();

      component.settingsKey = 'foobar';
      fixture.detectChanges();
      component.selectedColumnIds = ['column1', 'column2'];
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('Could not save grid settings.');
    });

    it('should suppress errors when getting config', () => {
      spyOn(uiConfigService, 'getConfig').and.callFake(() => {
        return Observable.throw(new Error());
      });

      const spy = spyOn(fixture.componentInstance.grid as any, 'initColumns').and.callThrough();

      component.columns = [
        new SkyGridColumnModel(component.template, {
          id: 'column1',
          heading: 'Column 1'
        })
      ];

      component.settingsKey = 'foobar';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
