import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

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
  SkyAppWindowRef,
  SkyUIConfigService
} from '@skyux/core';

import {
  DragulaService
} from 'ng2-dragula';

import {
  of as observableOf,
  throwError as observableThrowError
} from 'rxjs';

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
  SkyGridColumnModel
} from './grid-column.model';

import {
  SkyGridComponent
} from './grid.component';

import {
  SkyGridMessage
} from './types/grid-message';

import {
  SkyGridMessageType
} from './types/grid-message-type';

import {
  SkyGridSelectedRowsModelChange
} from './types/grid-selected-rows-model-change';

import {
  SkyGridSelectedRowsSource
} from './types/grid-selected-rows-source';

//#region helpers
function getColumnHeader(id: string, element: DebugElement): DebugElement {
  return element.query(
    By.css('th[sky-cmp-id="' + id + '"]')
  );
}

function getCell(rowId: string, columnId: string, element: DebugElement): DebugElement {
  return element.query(
    By.css('tr[sky-cmp-id="' + rowId + '"] sky-grid-cell[sky-cmp-id="' + columnId + '"]')
  );
}

function getElementCords(elementRef: any): any {
  const rect = (elementRef.nativeElement as HTMLElement).getBoundingClientRect();
  const coords = {
    x: Math.round(rect.left + (rect.width / 2)),
    y: Math.round(rect.top + (rect.height / 2))
  };

  return coords;
}

function getColumnWidths(fixture: ComponentFixture<any>): number[] {
  let expectedColumnWidths = new Array<number>();
  const tableHeaders = fixture.debugElement.queryAll(By.css('.sky-grid-heading'));
  tableHeaders.forEach(th => {
    expectedColumnWidths.push(Number(th.nativeElement.offsetWidth));
  });

  return expectedColumnWidths;
}

function getColumnResizeHandles(fixture: ComponentFixture<any>): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('.sky-grid-resize-handle'));
}

function getColumnRangeInputs(fixture: ComponentFixture<any>): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('.sky-grid-column-input-aria-only'));
}

function getColumnResizeInputMaxValues(fixture: ComponentFixture<any>): number[] {
  let resizeInputs = getColumnRangeInputs(fixture);
  let maxValues = new Array<number>();

  resizeInputs.forEach((input) => {
    maxValues.push(input.nativeElement.max);
  });
  return maxValues;
}

function resizeColumn(fixture: ComponentFixture<any>, deltaX: number, columnIndex: number): void {
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

function resizeColumnWithTouch(fixture: ComponentFixture<any>, deltaX: number, columnIndex: number): void {
  const resizeHandles = getColumnResizeHandles(fixture);
  let axis = getElementCords(resizeHandles[columnIndex]);
  let event = {
    target: resizeHandles[columnIndex].nativeElement,
    'pageX': axis.x,
    'preventDefault': function () { },
    'stopPropagation': function () { }
  };

  resizeHandles[columnIndex].triggerEventHandler('touchstart', event);
  fixture.detectChanges();

  SkyAppTestUtility.fireDomEvent(document, 'touchmove', {
    customEventInit: {
      pageX: axis.x + deltaX
    }
  });

  fixture.detectChanges();

  SkyAppTestUtility.fireDomEvent(document, 'touchend', {
    customEventInit: {
      pageX: axis.x + deltaX
    }
  });

  fixture.detectChanges();
}

function resizeColumnByRangeInput(fixture: ComponentFixture<any>, columnIndex: number, deltaX: number): void {
  const resizeInputs = getColumnRangeInputs(fixture);
  SkyAppTestUtility.fireDomEvent(resizeInputs[columnIndex].nativeElement, 'keydown', {
    keyboardEventInit: { key: 'ArrowRight' }
  });
  let newValue = Number(resizeInputs[columnIndex].nativeElement.value) + deltaX;
  resizeInputs[columnIndex].nativeElement.value = newValue;
  SkyAppTestUtility.fireDomEvent(resizeInputs[columnIndex].nativeElement, 'change', {});
}

function getTable(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-grid-table'));
}

function getTableContainer(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-grid-table-container'));
}

function getTableRows(fixture: ComponentFixture<any>): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('tbody tr'));
}

function getTableWidth(fixture: ComponentFixture<any>): number {
  const table = getTable(fixture);
  return table.nativeElement.offsetWidth;
}

function getTopScroll(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-grid-top-scroll'));
}

function getTopScrollContainer(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-grid-top-scroll-container'));
}

function getTopScrollWidth(fixture: ComponentFixture<any>): number {
  return getTopScroll(fixture).nativeElement.offsetWidth;
}

function cloneItems(items: any[]): any[] {
  return JSON.parse(JSON.stringify(items));
}

function isWithin(actual: number, base: number, distance: number): boolean {
  return Math.abs(actual - base) <= distance;
}

function verifyWidthsMatch(actual: number, expected: number): void {
  expect(isWithin(actual, expected, 5)).toEqual(true);
}

function verifyAllWidthsMatch(actualWidths: number[], expectedWidths: number[]): void {
  expect(actualWidths.length).toEqual(expectedWidths.length);
  for (let i = 0; i < actualWidths.length; i++) {
    expect(isWithin(actualWidths[i], expectedWidths[i], 1)).toEqual(true);
  }
}

function showColumn2(fixture: ComponentFixture<any>): void {
  let button = fixture.debugElement.query(By.css('#show-column-button'));
  button.nativeElement.click();
}

function hideColumn2(fixture: ComponentFixture<any>): void {
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
    function verifyHeaders(useAllHeaders = false, hiddenCol = false): void {
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

    function verifyConsumerColumnWidthsAreMaintained(): void {
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
            column4: new Date().getTime() + 600000
          },
          {
            id: '2',
            column1: '01',
            column2: 'Banana',
            column3: 1,
            column4: new Date().getTime() + 3000000,
            column5: 'test'
          },
          {
            id: '3',
            column1: '11',
            column2: 'Carrot',
            column3: 11,
            column4: new Date().getTime() + 2400000
          },
          {
            id: '4',
            column1: '12',
            column2: 'Daikon',
            column3: 12,
            column4: new Date().getTime() + 1200000
          },
          {
            id: '5',
            column1: '13',
            column2: 'Edamame',
            column3: 13,
            column4: new Date().getTime() + 3000000
          },
          {
            id: '6',
            column1: '20',
            column2: 'Fig',
            column3: 20,
            column4: new Date().getTime() + 1800000
          },
          {
            id: '7',
            column1: '21',
            column2: 'Grape',
            column3: 21,
            column4: new Date().getTime() + 5600000
          }
        ];

        fixture.detectChanges();
        fixture.detectChanges();

        verifyData(true);

      });

      it('should change displayed headers and data when selected columnids change and emit the change event', async(() => {
        fixture.detectChanges();

        const selectedColumnIds = [
          'column1',
          'column2',
          'column3',
          'column4',
          'column5',
          'hiddenCol1',
          'hiddenCol2'
        ];

        const changeSpy = spyOn(component.grid.selectedColumnIdsChange, 'emit').and.callThrough();

        component.selectedColumnIds = selectedColumnIds;
        fixture.detectChanges();

        expect(changeSpy.calls.count()).toEqual(1);
        expect(changeSpy).toHaveBeenCalledWith(selectedColumnIds);
        changeSpy.calls.reset();

        component.selectedColumnIds = [...selectedColumnIds];
        fixture.detectChanges();

        expect(changeSpy.calls.count()).toEqual(
          0,
          'Setting selectedColumnIds with the same value should not emit changes.'
        );

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

      it('should show inline help component when inlineHelpPopover is provided', () => {
        const header1 = getColumnHeader('column1', element);
        const header2 = getColumnHeader('column2', element);
        const header4 = getColumnHeader('column4', element);

        // Coulumns 1 and 3 should have inline help icons.
        expect(header1.nativeElement.querySelector('sky-help-inline')).not.toBeNull();
        expect(header2.nativeElement.querySelector('sky-help-inline')).toBeNull();
        expect(header4.nativeElement.querySelector('sky-help-inline')).not.toBeNull();
      });

      it('should handle different inlineHelpPopover content for different columns', async(() => {
        fixture.detectChanges();
        fixture.detectChanges();

        const header1 = getColumnHeader('column1', element);
        const header4 = getColumnHeader('column4', element);
        const inlineHelp1 = header1.nativeElement.querySelector('sky-help-inline');
        const inlineHelp4 = header4.nativeElement.querySelector('sky-help-inline');

        // Open column 1 help popup.
        inlineHelp1.click();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          let popupContent = document.querySelector('.sky-popover-body');

          // Expect column 1 popup to contain column 1 content.
          expect(popupContent.textContent.trim()).toEqual('Help content for column 1.');

          // Open column 4 help popup.
          popupContent.parentNode.removeChild(popupContent);
          inlineHelp4.click();

          fixture.detectChanges();

          fixture.whenStable().then(() => {
            fixture.detectChanges();
            popupContent = document.querySelector('.sky-popover-body');

            // Expect column 4 popup to contain column 4 content.
            expect(popupContent.textContent.trim()).toEqual('Help content for column 4.');
          });
        });
      }));

      it('should pass accessibility', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));

      describe('sorting', () => {
        it('adds appropriate icons and styles, and emits event on click to headers', () => {
          let headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          let skyIcon = headerEl.querySelector('sky-icon') as HTMLElement;
          expect(skyIcon).toHaveCssClass('sky-grid-heading-sort-hidden');
          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: true });
          expect(headerEl.querySelector('i')).toHaveCssClass('fa-caret-down');
          expect(skyIcon).toHaveCssClass('sky-grid-heading-sort-visible');

          SkyAppTestUtility.fireDomEvent(headerEl, 'mouseup',
            { bubbles: false, cancelable: false });
          fixture.detectChanges();

          headerEl = nativeElement.querySelectorAll('th').item(0) as HTMLElement;
          expect(component.activeSortSelector)
            .toEqual({ fieldSelector: 'column1', descending: false });
          expect(headerEl.querySelector('i')).toHaveCssClass('fa-caret-up');
          expect(skyIcon).toHaveCssClass('sky-grid-heading-sort-visible');
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

        it('should show vertical resize bar when range input is focused with keyboard', fakeAsync(() => {
          fixture.detectChanges();
          let inputRange = getColumnRangeInputs(fixture)[1];

          SkyAppTestUtility.fireDomEvent(inputRange.nativeElement, 'focus');
          let resizeBar = fixture.nativeElement.querySelector('#sky-grid-resize-bar');

          expect(resizeBar).not.toBeNull();

          SkyAppTestUtility.fireDomEvent(inputRange.nativeElement, 'blur');
          fixture.detectChanges();
          resizeBar = fixture.nativeElement.querySelector('#sky-grid-resize-bar');

          expect(resizeBar).toBeNull();
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

        it('should NOT set table width if selectedColumnIds property changes and user has NOT resized columns', fakeAsync(() => {
          // Update selected columns.
          component.selectedColumnIds = ['column1'];
          fixture.detectChanges();
          tick();

          const table = getTable(fixture);
          const tableStyle = table.nativeElement.getAttribute('style');

          expect(tableStyle).toBeNull();
        }));
      });
    });

    describe('top scroll', () => {
      it('should set top scroll width to the tables width on load when needed', async(() => {
        fixture.componentInstance.dynamicWidth = 5000;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(getTableWidth(fixture)).toEqual(getTopScrollWidth(fixture));
        });
      }));

      it('should set top scroll width to the tables width on window resize when needed', async(() => {
        fixture.detectChanges();
        spyOnProperty(TestBed.get(SkyAppWindowRef), 'nativeWindow', 'get').and.returnValue({ innerWidth: 100 });
        SkyAppTestUtility.fireDomEvent(window, 'resize');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(getTableWidth(fixture)).toEqual(getTopScrollWidth(fixture));
        });
      }));

      it('should set top scroll width to the tables width after resize', async(() => {
        fixture.detectChanges();
        resizeColumn(fixture, 5000, 0);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(getTableWidth(fixture)).toEqual(getTopScrollWidth(fixture));
        });
      }));

      it('should trigger a scroll to the grid when the top scroll bar scrolls', async(() => {
        fixture.componentInstance.dynamicWidth = 5000;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          let topScrollSpy = spyOn(fixture.componentInstance.grid, 'onTopScroll').and.callThrough();
          let tableContainerScrollSpy = spyOnProperty(getTableContainer(fixture).nativeElement, 'scrollLeft', 'set');
          getTopScrollContainer(fixture).nativeElement.scrollLeft = '400';
          SkyAppTestUtility.fireDomEvent(getTopScrollContainer(fixture).nativeElement, 'scroll');
          SkyAppTestUtility.fireDomEvent(getTopScrollContainer(fixture).nativeElement, 'scroll');
          fixture.detectChanges();

          expect(topScrollSpy).toHaveBeenCalled();
          expect(tableContainerScrollSpy).toHaveBeenCalled();
        });
      }));

      it('should trigger a scroll to the top scroll when the grid scrolls', async(() => {
        fixture.componentInstance.dynamicWidth = 5000;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          let tableContainerScrollSpy = spyOn(fixture.componentInstance.grid, 'onGridScroll').and.callThrough();
          let topScrollSpy = spyOnProperty(getTopScrollContainer(fixture).nativeElement, 'scrollLeft', 'set');
          getTableContainer(fixture).nativeElement.scrollLeft = '400';
          SkyAppTestUtility.fireDomEvent(getTableContainer(fixture).nativeElement, 'scroll');
          SkyAppTestUtility.fireDomEvent(getTableContainer(fixture).nativeElement, 'scroll');
          fixture.detectChanges();

          expect(topScrollSpy).toHaveBeenCalled();
          expect(tableContainerScrollSpy).toHaveBeenCalled();
        });
      }));

      it('should set top scroll width to the tables width on column changes when needed', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.componentInstance.grid.showTopScroll).toBeFalsy();
          fixture.componentInstance.showWideColumn = true;

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(fixture.componentInstance.grid.showTopScroll).toBeTruthy();
            expect(getTableWidth(fixture)).toEqual(getTopScrollWidth(fixture));
          });
        });
      }));

      it('should set top scroll width to the tables width on data when needed', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.grid.showTopScroll).toBeFalsy();
        fixture.componentInstance.addLongData();

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.grid.showTopScroll).toBeTruthy();
        expect(getTableWidth(fixture)).toEqual(getTopScrollWidth(fixture));
      }));
    });

    describe('row delete', () => {

      it('should show row delete elements correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(2);
      }));

      it('should cancel row delete elements correctly via the message stream', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        fixture.componentInstance.cancelRowDelete({ id: '1' });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();
      }));

      it('should cancel row delete elements correctly via click', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();
        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        fixture.nativeElement.querySelectorAll('.sky-inline-delete .sky-btn-default')[0].click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();
      }));

      it('should update the pending status of a row being deleted correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).toBeNull();

        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(fixture.nativeElement
          .querySelectorAll('.sky-grid-row-delete-cell .sky-wait-mask-loading-blocking').length)
          .toBe(0);

        fixture.nativeElement.querySelectorAll('.sky-inline-delete-button')[0].click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(fixture.nativeElement
          .querySelectorAll('.sky-grid-row-delete-cell .sky-wait-mask-loading-blocking').length)
          .toBe(1);

        fixture.componentInstance.deleteItem('1');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.sky-grid-row-delete-heading')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.sky-grid-row-delete-cell').length).toBe(7);
        expect(fixture.nativeElement.querySelectorAll('.sky-inline-delete-standard').length).toBe(1);
        expect(fixture.nativeElement
          .querySelectorAll('.sky-grid-row-delete-cell .sky-wait-mask-loading-blocking').length)
          .toBe(0);
      }));

      it('should output the delete event correctly', fakeAsync(() => {
        spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
        spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        fixture.componentInstance.deleteItem('1');
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();
        fixture.nativeElement.querySelectorAll('.sky-inline-delete-button')[0].click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();
        expect(fixture.componentInstance.finishRowDelete).toHaveBeenCalledWith({ id: '1' });
      }));

      it('should output the cancel event correctly', fakeAsync(() => {
        spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
        spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();
        fixture.detectChanges();
        tick();
        fixture.componentInstance.deleteItem('1');
        fixture.componentInstance.deleteItem('2');
        fixture.detectChanges();
        tick();
        expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();
        fixture.nativeElement.querySelectorAll('.sky-inline-delete .sky-btn-default')[0].click();
        fixture.detectChanges();
        tick();
        expect(fixture.componentInstance.cancelRowDelete).toHaveBeenCalledWith({ id: '1' });
        expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();
      }));

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
        const spy = spyOn(fixture.componentInstance.grid, 'onResizeHandleMove').and.callThrough();
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
        const spy = spyOn(fixture.componentInstance.grid, 'onResizeHandleMove').and.callThrough();
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

      it('should support touch events', fakeAsync(() => {
        const startSpy = spyOn(fixture.componentInstance.grid, 'onResizeColumnStart').and.callThrough();
        const moveSpy = spyOn(fixture.componentInstance.grid, 'onResizeHandleMove').and.callThrough();
        const releaseSpy = spyOn(fixture.componentInstance.grid, 'onResizeHandleRelease').and.callThrough();

        // Resize first column with touch event.
        resizeColumnWithTouch(fixture, 50, 0);

        // Assert spys were called.
        expect(startSpy).toHaveBeenCalled();
        expect(moveSpy).toHaveBeenCalled();
        expect(releaseSpy).toHaveBeenCalled();
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

    //#region multiselect helpers
    function getMultiselectInputs(): DebugElement[] {
      return fixture.debugElement.queryAll(By.css('tbody .sky-grid-multiselect-cell input'));
    }

    function verifyCheckbox(index: number, checked: boolean): void {
      const checkboxes = getMultiselectInputs();
      const tableRows = getTableRows(fixture);

      expect(component.data[index].isSelected = checked);
      expect(checkboxes[index].nativeElement.checked = checked);
      if (checked) {
        expect(tableRows[index].nativeElement).toHaveCssClass('sky-grid-multiselect-selected-row');
      } else {
        expect(tableRows[index].nativeElement).not.toHaveCssClass('sky-grid-multiselect-selected-row');
      }
    }
    //#endregion

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
        tick();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, 'id'.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['1', '2', '5'],
          source: SkyGridSelectedRowsSource.CheckboxChange
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
            selectedRowIds: ['1', '2', '5'],
            source: SkyGridSelectedRowsSource.RowClick
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
        tick();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, 'customId'.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['101', '102', '105'],
          source: SkyGridSelectedRowsSource.CheckboxChange
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
        tick();

        // Expect the emitter to send us 1,2,5.
        // Values should match the row value of the consumer-provided key in 'multiselectRowId'.
        // In this example, there is no match so it should fall back to the 'id' property.
        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['1', '2', '5'],
          source: SkyGridSelectedRowsSource.CheckboxChange
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
          verifyCheckbox(i, true);
        }

        let expectedRows: SkyGridSelectedRowsModelChange = {
          selectedRowIds: ['1', '2', '3', '4', '5', '6', '7'],
          source: SkyGridSelectedRowsSource.SelectAll
        };
        expect(component.selectedRowsChange).toEqual(expectedRows);

        const clearAllMessage: SkyGridMessage = { type: SkyGridMessageType.ClearAll };
        fixture.componentInstance.gridController.next(clearAllMessage);
        fixture.detectChanges();

        for (let i = 0; i < checkboxes.length; i++) {
          verifyCheckbox(i, false);
        }

        expectedRows = {
          selectedRowIds: [],
          source: SkyGridSelectedRowsSource.ClearAll
        };
        expect(component.selectedRowsChange).toEqual(expectedRows);
      });

      it('should check checkboxes when selectedRowIds is set on init', () => {
        // Re-initialize component with 1 and 3 pre-selected.
        fixture = TestBed.createComponent(GridTestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement as DebugElement;
        component.enableMultiselect = true;
        component.selectedRowIds = ['1', '3'];
        fixture.detectChanges();
        fixture.detectChanges();

        // Verify those rows are selected and displayed properly.
        verifyCheckbox(0, true);
        verifyCheckbox(1, false);
        verifyCheckbox(2, true);
        verifyCheckbox(3, false);
        verifyCheckbox(4, false);
        verifyCheckbox(5, false);
        verifyCheckbox(6, false);
      });

      it('should properly update the checkboxes when selectedRowIds is changed', () => {
        // Select group of rows.
        let selectedIds = ['1', '3'];
        component.selectedRowIds = selectedIds;
        fixture.detectChanges();

        // Verify those rows are selected and displayed properly.
        verifyCheckbox(0, true);
        verifyCheckbox(1, false);
        verifyCheckbox(2, true);
        verifyCheckbox(3, false);
        verifyCheckbox(4, false);
        verifyCheckbox(5, false);
        verifyCheckbox(6, false);

        // Send another selection.
        selectedIds = ['5'];
        component.selectedRowIds = selectedIds;
        fixture.detectChanges();

        // Verify new rows are selected and displayed properly.
        verifyCheckbox(0, false);
        verifyCheckbox(1, false);
        verifyCheckbox(2, false);
        verifyCheckbox(3, false);
        verifyCheckbox(4, true);
        verifyCheckbox(5, false);
        verifyCheckbox(6, false);

        // Send empty array.
        selectedIds = [];
        component.selectedRowIds = selectedIds;
        fixture.detectChanges();

        // Verify no rows are selected.
        verifyCheckbox(0, false);
        verifyCheckbox(1, false);
        verifyCheckbox(2, false);
        verifyCheckbox(3, false);
        verifyCheckbox(4, false);
        verifyCheckbox(5, false);
        verifyCheckbox(6, false);
      });

      it('should be accessible', async(() => {
        fixture.detectChanges();

        const inputs = getMultiselectInputs();

        // Run accessibility test.
        fixture.whenStable().then(() => {
          fixture.detectChanges();

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
      component: GridInteractiveTestComponent;

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
      component.enableMultiselect = true;
      component.multiselectRowId = 'id';
      fixture.detectChanges();
      fixture.detectChanges();
    });

    function getMultiselectInputs(): DebugElement[] {
      return fixture.debugElement.queryAll(By.css('tbody .sky-grid-multiselect-cell input'));
    }

    function getButtons(): DebugElement[] {
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
              expect(elementSelector).toBe('th:not(.sky-grid-multiselect-cell):not(.sky-grid-row-delete-heading)');
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
      const standardHandleElement: any = {
        classList: {
          contains(classSelector: string) {
            return false;
          }
        },
        matches(selector: string) {
          return (selector === '.sky-grid-header');
        },
        querySelector(selector: string): any {
          return undefined;
        }
      };

      const lockedHandleElement: any = {
        classList: {
          contains(classSelector: string) {
            return false;
          }
        },
        matches(selector: string) {
          return (selector === '.sky-grid-header-locked');
        },
        querySelector(selector: string): any {
          return undefined;
        }
      };

      const resizeHandleElement: any = {
        classList: {
          contains(classSelector: string) {
            return false;
          }
        },
        matches(selector: string) {
          return (selector === '.sky-grid-resize-handle');
        },
        querySelector(selector: string): any {
          return undefined;
        }
      };

      const standardMockElement: any = {
        querySelector(selector: string): any {
          return undefined;
        },
        querySelectorAll(selector: string) {
          return [
            standardHandleElement
          ];
        }
      };

      const lockedColumnMockElement: any = {
        querySelector(selector: string): any {
          // NOTE: We need an element to return here but the fixture isn't yet rendered due
          // to the timing we need so the doucment element is enough to suffice what we are
          // testing here.
          return document;
        },
        querySelectorAll(selector: string) {
          return [
            standardHandleElement
          ];
        }
      };

      const lockedSiblingMockElement: any = {
        querySelector(selector: string): any {
          return undefined;
        },
        querySelectorAll(selector: string) {
          return [
            {
              classList: {
                contains(classSelector: string) {
                  return true;
                }
              }
            }
          ];
        }
      };

      const setOptionsSpy = spyOn(mockDragulaService, 'setOptions').and
        .callFake((bagId: any, options: any) => {
          const moveOptionValid = options.moves(
            standardMockElement,
            standardMockElement,
            standardHandleElement
          );

          const moveOptionLeftOfLocked = options.moves(
            standardMockElement,
            lockedSiblingMockElement,
            standardHandleElement
          );

          const moveOptionLockedHeader = options.moves(
            lockedColumnMockElement,
            standardMockElement,
            standardHandleElement
          );

          const moveOptionFromResize = options.moves(
            standardMockElement,
            standardMockElement,
            resizeHandleElement
          );

          const moveOptionUndefinedHandle = options.moves(
            standardMockElement,
            standardMockElement,
            undefined
          );

          const acceptsOption = options.accepts(
            undefined,
            undefined,
            standardMockElement,
            standardHandleElement
          );

          const acceptsOptionLoopBreak = options.accepts(
            undefined,
            undefined,
            standardMockElement,
            {
              querySelector(selector: string) {
                return standardHandleElement;
              },
              matches(selector: string) {
                return false;
              }
            }
          );

          const acceptsOptionUndefinedSibiling = options.accepts(
            undefined,
            undefined,
            standardMockElement,
            undefined
          );

          const acceptsOptionLockedHandle = options.accepts(
            undefined,
            undefined,
            standardMockElement,
            lockedHandleElement
          );

          const acceptsOptionResizeHandle = options.accepts(
            undefined,
            undefined,
            standardMockElement,
            resizeHandleElement
          );

          const acceptsOptionLeftOfLocked = options.accepts(
            undefined,
            undefined,
            lockedSiblingMockElement,
            standardHandleElement
          );

          expect(moveOptionValid).toBeTruthy();
          expect(moveOptionLockedHeader).toBeFalsy();
          expect(moveOptionLeftOfLocked).toBeFalsy();
          expect(moveOptionFromResize).toBeFalsy();
          expect(moveOptionUndefinedHandle).toBeFalsy();
          expect(acceptsOption).toBeTruthy();
          expect(acceptsOptionLoopBreak).toBeTruthy();
          expect(acceptsOptionUndefinedSibiling).toBeTruthy();
          expect(acceptsOptionLockedHandle).toBeFalsy();
          expect(acceptsOptionResizeHandle).toBeFalsy();
          expect(acceptsOptionLeftOfLocked).toBeFalsy();
        });

      fixture.detectChanges();
      fixture.detectChanges();
      expect(setOptionsSpy).toHaveBeenCalled();
    });

    it('should prevent default behavior when dragging columns on mobile devices', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      const eventSpy = jasmine.createSpyObj('event', ['preventDefault']);

      SkyGridComponent.prototype.onTouchMove(eventSpy);

      expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.detectChanges();

      mockDragulaService.drag.emit([
        undefined,
        {
          classList: {
            add(cls: string) {
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

    function verifyHeaders(hideColumn = false): void {
      const headerCount = hideColumn ? 1 : 2;

      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(headerCount);
      expect(getColumnHeader('column1', element).nativeElement.textContent.trim()).toBe('Column 1');

      if (!hideColumn) {
        expect(getColumnHeader('column2', element).nativeElement.textContent.trim())
          .toBe('Column 2');
      }
    }

    function verifyData(hideColumn = false): void {
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

    function verifyColumnHeaders(id: string): void {
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

    it('should handle async column inline help', fakeAsync(() => {
      fixture.detectChanges();

      const missingInlineHelp = fixture.nativeElement.querySelector('sky-help-inline');
      expect(missingInlineHelp).toBeNull();

      tick(110); // wait for setTimeout
      fixture.detectChanges();
      tick();

      const inlineHelp = fixture.nativeElement.querySelector('sky-help-inline');
      expect(inlineHelp).not.toBeNull();
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
    let element: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          GridFixturesModule
        ]
      });

      fixture = TestBed.createComponent(GridEmptyTestComponent);
      component = fixture.componentInstance;
      uiConfigService = TestBed.get(SkyUIConfigService);
      element = fixture.debugElement as DebugElement;
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

    it(`should not error when columns are returned from UI config service that don't exist`, () => {
      // Start with two columns.
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

      // Return a fake from the uiConfigService of the two columns above, plus one bad column.
      const columns = { selectedColumnIds: ['column1', 'column2', 'columnBAD'] };
      spyOn(uiConfigService, 'getConfig').and.returnValue(observableOf(columns));
      component.settingsKey = 'foobar';
      fixture.detectChanges();

      // Expect only the two good columns to show on the grid.
      expect(element.queryAll(By.css('th.sky-grid-heading')).length).toBe(2);
      expect(getColumnHeader('column1', element).nativeElement.textContent.trim()).toBe('Column 1');
      expect(getColumnHeader('column2', element).nativeElement.textContent.trim()).toBe('Column 2');
    });

    it('should handle errors when setting config', () => {
      const spy = spyOn(console, 'warn');

      spyOn(uiConfigService, 'setConfig').and.callFake(() => {
        // tslint:disable-next-line: deprecation
        return observableThrowError(new Error());
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

    it('should suppress errors when getting config', async(() => {
      spyOn(uiConfigService, 'getConfig').and.callFake(() => {
        return observableThrowError(new Error());
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
    }));
  });
});
