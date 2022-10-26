import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import {
  Column,
  ColumnApi,
  DetailGridInfo,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowDataUpdatedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, Subject } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';
import { SkyAgGridModule } from './ag-grid.module';
import {
  EnableTopScroll,
  SkyAgGridFixtureComponent,
} from './fixtures/ag-grid.component.fixture';

describe('SkyAgGridWrapperComponent', () => {
  let gridAdapterService: SkyAgGridAdapterService;
  let gridWrapperFixture: ComponentFixture<SkyAgGridWrapperComponent>;
  let gridWrapperComponent: SkyAgGridWrapperComponent;
  let gridWrapperNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  const agGrid: AgGridAngular = {
    api: new GridApi(),
    columnApi: new ColumnApi(),
    gridReady: new Subject<GridReadyEvent>(),
    rowDataUpdated: new Subject<RowDataUpdatedEvent>(),
    firstDataRendered: new Subject<FirstDataRenderedEvent>(),
  } as AgGridAngular;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: {
          theme: SkyTheme.presets.default,
          mode: SkyThemeMode.presets.light,
        },
        previousSettings: undefined,
      }),
    };
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
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

  it('should apply ag-theme', async () => {
    expect(gridWrapperComponent.agThemeClass).toEqual('ag-theme-sky-default');

    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.modern,
        mode: SkyThemeMode.presets.light,
      },
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.agThemeClass).toEqual(
      'ag-theme-sky-modern-light'
    );

    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.modern,
        mode: SkyThemeMode.presets.dark,
      },
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.agThemeClass).toEqual(
      'ag-theme-sky-modern-dark'
    );

    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.default,
        mode: SkyThemeMode.presets.light,
      },
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.agThemeClass).toEqual('ag-theme-sky-default');
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
      const col = {} as Column;
      spyOn(gridAdapterService, 'setFocusedElementById');
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([
        { rowIndex: 0, column: col, rowPinned: undefined },
      ]);

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when tab is pressed but master/detail cells are being edited', () => {
      const col = {} as Column;
      spyOn(gridAdapterService, 'setFocusedElementById');
      spyOn(agGrid.api, 'getEditingCells').and.returnValue([]);
      spyOn(agGrid.api, 'forEachDetailGridInfo').and.callFake((fn) => {
        fn(
          {
            api: {
              getEditingCells: (): any[] => {
                return [{ rowIndex: 0, column: col, rowPinned: '' }];
              },
            } as GridApi,
          } as DetailGridInfo,
          0
        );
      });

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
      spyOn(agGrid.api, 'forEachDetailGridInfo').and.callFake((fn) => {
        fn(
          {
            api: {
              getEditingCells: (): any[] => {
                return [];
              },
            } as GridApi,
          } as DetailGridInfo,
          0
        );
      });
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

  describe('onKeyUpEscape', () => {
    let skyAgGridDivEl: HTMLElement;
    beforeEach(() => {
      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`
      );
    });

    function fireKeyupEscape(): void {
      SkyAppTestUtility.fireDomEvent(skyAgGridDivEl, 'keyup', {
        keyboardEventInit: {
          key: 'Escape',
        },
      });
      gridWrapperFixture.detectChanges();
    }

    it('should not move focus when tab is pressed but cells are being edited', () => {
      spyOn(agGrid.api, 'stopEditing');
      fireKeyupEscape();
      expect(agGrid.api.stopEditing).toHaveBeenCalled();
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

describe('SkyAgGridWrapperComponent via fixture', () => {
  let gridWrapperFixture: ComponentFixture<SkyAgGridFixtureComponent>;
  let gridWrapperNativeElement: HTMLElement;
  const getChildrenClassNames = () =>
    Array.from(
      gridWrapperNativeElement.querySelector('.ag-root')?.children || []
    ).map((el: HTMLElement) => el.classList[0]);

  it('should move the horizontal scroll based on enableTopScroll check, static data', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
      providers: [
        {
          provide: EnableTopScroll,
          useValue: true,
        },
      ],
    });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-body-horizontal-scroll',
      'ag-floating-top',
      'ag-body-viewport',
      'ag-sticky-top',
      'ag-floating-bottom',
      'ag-overlay',
    ]);
  });

  it('should move the horizontal scroll based on enableTopScroll check, async loading', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
    });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-floating-top',
      'ag-body-viewport',
      'ag-sticky-top',
      'ag-floating-bottom',
      'ag-body-horizontal-scroll',
      'ag-overlay',
    ]);

    gridWrapperFixture.componentInstance.gridOptions.context = {
      enableTopScroll: true,
    };
    gridWrapperFixture.componentInstance.agGrid.gridReady.emit();

    // Expect the scrollbar below the header.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-body-horizontal-scroll',
      'ag-floating-top',
      'ag-body-viewport',
      'ag-sticky-top',
      'ag-floating-bottom',
      'ag-overlay',
    ]);

    gridWrapperFixture.componentInstance.gridOptions.context = {
      enableTopScroll: false,
    };
    gridWrapperFixture.componentInstance.agGrid.rowDataUpdated.emit();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-floating-top',
      'ag-body-viewport',
      'ag-sticky-top',
      'ag-floating-bottom',
      'ag-body-horizontal-scroll',
      'ag-overlay',
    ]);
  });
});
