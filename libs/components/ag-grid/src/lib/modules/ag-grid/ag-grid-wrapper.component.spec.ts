import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { AgGridAngular } from 'ag-grid-angular';
import { Column, ColumnApi, GridApi } from 'ag-grid-community';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';
import { SkyAgGridModule } from './ag-grid.module';

describe('SkyAgGridWrapperComponent', () => {
  let gridAdapterService: SkyAgGridAdapterService;
  let gridWrapperFixture: ComponentFixture<SkyAgGridWrapperComponent>;
  let gridWrapperComponent: SkyAgGridWrapperComponent;
  let gridWrapperNativeElement: HTMLElement;

  const agGrid: AgGridAngular = {
    api: new GridApi(),
    columnApi: new ColumnApi(),
  } as AgGridAngular;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
    });

    gridWrapperFixture = TestBed.createComponent(SkyAgGridWrapperComponent);
    gridAdapterService = TestBed.inject(SkyAgGridAdapterService);
    gridWrapperComponent = gridWrapperFixture.componentInstance;
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;
    gridWrapperComponent.agGrid = agGrid;

    gridWrapperFixture.detectChanges();
  });

  it('should render a sky-ag-grid-wrapper element', () => {
    expect(gridWrapperNativeElement).toBeVisible();
  });

  it('should add .ag-header to the viewkeeper classes when the domLayout is set to autoHeight', () => {
    agGrid.gridOptions = { domLayout: 'autoHeight' };

    const autoHeightGridWrapperFixture = TestBed.createComponent(
      SkyAgGridWrapperComponent
    );
    const autoHeightGridWrapperComponent =
      autoHeightGridWrapperFixture.componentInstance;
    autoHeightGridWrapperComponent.agGrid = agGrid;

    autoHeightGridWrapperFixture.detectChanges();

    expect(
      autoHeightGridWrapperComponent.viewkeeperClasses.indexOf('.ag-header')
    ).not.toEqual(-1);
  });

  describe('onGridKeydown', () => {
    let skyAgGridDivEl: HTMLElement;
    beforeEach(() => {
      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`
      );
    });

    function fireKeydownOnGrid(key: string, shiftKey: boolean): void {
      SkyAppTestUtility.fireDomEvent(skyAgGridDivEl, 'keydown', {
        keyboardEventInit: {
          key,
          shiftKey,
        },
      });

      gridWrapperFixture.detectChanges();
    }

    it('should not move focus when tab is pressed but cells are being edited', () => {
      let col = {} as Column;
      spyOn(gridAdapterService, 'setFocusedElementById');
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([
        { rowIndex: 0, column: col, rowPinned: '' },
      ]);

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when tab is pressed but master/detail cells are being edited', () => {
      let col = {} as Column;
      spyOn(gridAdapterService, 'setFocusedElementById');
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([]);
      spyOn(agGrid.api, 'forEachDetailGridInfo').and.callFake(
        (fn: Function) => {
          fn({
            api: {
              getEditingCells: (): any[] => {
                return [{ rowIndex: 0, column: col, rowPinned: '' }];
              },
            },
          });
        }
      );

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when a non-tab key is pressed', () => {
      spyOn(gridAdapterService, 'setFocusedElementById');
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([]);

      fireKeydownOnGrid('L', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it(`should move focus to the anchor after the grid when tab is pressed, no cells are being edited,
      and the grid was previously focused`, () => {
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([]);
      spyOn(agGrid.api, 'forEachDetailGridInfo').and.callFake(
        (fn: Function) => {
          fn({
            api: {
              getEditingCells: (): any[] => {
                return [];
              },
            },
          });
        }
      );
      spyOn(gridAdapterService, 'getFocusedElement').and.returnValue(
        skyAgGridDivEl
      );
      spyOn(gridAdapterService, 'setFocusedElementById');

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).toHaveBeenCalledWith(
        gridWrapperNativeElement,
        gridWrapperComponent.afterAnchorId
      );
    });

    it(`should move focus to the anchor before the grid when shift + tab is pressed, no cells are being edited,
      and the grid was previous focused`, () => {
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([]);
      spyOn(gridAdapterService, 'getFocusedElement').and.returnValue(
        skyAgGridDivEl
      );
      spyOn(gridAdapterService, 'setFocusedElementById');

      fireKeydownOnGrid('Tab', true);

      expect(gridAdapterService.setFocusedElementById).toHaveBeenCalledWith(
        gridWrapperNativeElement,
        gridWrapperComponent.beforeAnchorId
      );
    });
  });

  describe('onAnchorFocus', () => {
    function focusOnAnchor(
      anchorEl: HTMLElement,
      previousFocusedEl: HTMLElement
    ): void {
      SkyAppTestUtility.fireDomEvent(anchorEl, 'focusin', {
        customEventInit: {
          relatedTarget: previousFocusedEl,
        },
      });

      gridWrapperFixture.detectChanges();
    }

    it('should shift focus to the first grid cell if it was not the previously focused element and there is a cell', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.afterAnchorId}`
      ) as HTMLElement;
      const afterButtonEl = gridWrapperNativeElement.querySelector(
        '#button-after-grid'
      ) as HTMLElement;
      const column = new Column({}, {}, 'name', true);
      const rowIndex = 0;

      spyOn(agGrid.columnApi, 'getAllDisplayedColumns').and.returnValue([
        column,
      ]);
      spyOn(agGrid.api, 'getFirstDisplayedRow').and.returnValue(rowIndex);
      spyOn(agGrid.api, 'setFocusedCell');

      focusOnAnchor(afterAnchorEl, afterButtonEl);

      expect(agGrid.api.setFocusedCell).toHaveBeenCalledWith(rowIndex, column);
    });

    it('should not shift focus to the first grid cell if there is no cell', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.afterAnchorId}`
      ) as HTMLElement;
      const afterButtonEl = gridWrapperNativeElement.querySelector(
        '#button-after-grid'
      ) as HTMLElement;
      const column = new Column({}, {}, 'name', true);

      spyOn(agGrid.columnApi, 'getAllDisplayedColumns').and.returnValue([
        column,
      ]);
      spyOn(agGrid.api, 'getFirstDisplayedRow').and.returnValue(undefined);
      spyOn(agGrid.api, 'setFocusedCell');

      focusOnAnchor(afterAnchorEl, afterButtonEl);

      expect(agGrid.api.setFocusedCell).not.toHaveBeenCalled();
    });

    it('should not shift focus to the grid if it was the previously focused element', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.afterAnchorId}`
      ) as HTMLElement;
      const gridEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`
      ) as HTMLElement;
      spyOn(gridAdapterService, 'setFocusedElementById');

      focusOnAnchor(afterAnchorEl, gridEl);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });
  });
});
