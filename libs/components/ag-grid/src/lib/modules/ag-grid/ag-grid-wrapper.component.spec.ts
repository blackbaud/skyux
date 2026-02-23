import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
  SkyThemeSpacing,
} from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AgColumn,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  CellFocusedEvent,
  DetailGridInfo,
  FirstDataRenderedEvent,
  FocusGridInnerElementParams,
  GridApi,
  GridReadyEvent,
  HeaderFocusedEvent,
  RowDataUpdatedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, EMPTY, Subject, firstValueFrom } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';
import {
  Editable,
  EnableTopScroll,
  SkyAgGridFixtureComponent,
} from './fixtures/ag-grid.component.fixture';
import { SecondInlineHelpComponent } from './fixtures/inline-help.component';
import { SkyCellType } from './types/cell-type';

describe('SkyAgGridWrapperComponent', () => {
  let gridFixture: ComponentFixture<SkyAgGridFixtureComponent>;
  let gridAdapterService: SkyAgGridAdapterService;
  let gridWrapperFixture: ComponentFixture<SkyAgGridWrapperComponent>;
  let gridWrapperComponent: SkyAgGridWrapperComponent;
  let gridWrapperNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  let agGrid: AgGridAngular;

  beforeEach(async () => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureComponent],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideNoopAnimations(),
      ],
    });
    gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);

    gridFixture.detectChanges();
    await gridFixture.whenStable();
    gridFixture.detectChanges();
    await gridFixture.whenStable();

    expect(gridFixture.componentInstance.agGrid?.api).toBeDefined();
    const agGridApi = gridFixture.componentInstance.agGrid?.api as GridApi;
    const api = {
      ensureColumnVisible: spyOn(agGridApi, 'ensureColumnVisible'),
      ensureIndexVisible: spyOn(agGridApi, 'ensureIndexVisible'),
      forEachDetailGridInfo: spyOn(agGridApi, 'forEachDetailGridInfo'),
      getAllDisplayedColumns: spyOn(agGridApi, 'getAllDisplayedColumns'),
      getDisplayedRowAtIndex: spyOn(agGridApi, 'getDisplayedRowAtIndex'),
      getEditingCells: spyOn(agGridApi, 'getEditingCells').and.returnValue([]),
      getGridOption: spyOn(agGridApi, 'getGridOption').and.returnValue(false),
      isDestroyed: spyOn(agGridApi, 'isDestroyed'),
      redrawRows: spyOn(agGridApi, 'redrawRows'),
      refreshCells: spyOn(agGridApi, 'refreshCells'),
      refreshHeader: spyOn(agGridApi, 'refreshHeader'),
      resetRowHeights: spyOn(agGridApi, 'resetRowHeights'),
      setFocusedCell: spyOn(agGridApi, 'setFocusedCell'),
      setFocusedHeader: spyOn(agGridApi, 'setFocusedHeader'),
      setGridOption: spyOn(agGridApi, 'setGridOption'),
      stopEditing: spyOn(agGridApi, 'stopEditing'),
      updateGridOptions: spyOn(agGridApi, 'updateGridOptions'),
    };
    agGrid = {
      api,
      gridOptions: gridFixture.componentInstance.gridOptions,
      gridReady: new Subject<GridReadyEvent>(),
      rowDataUpdated: new Subject<RowDataUpdatedEvent>(),
      firstDataRendered: new Subject<FirstDataRenderedEvent>(),
      cellEditingStarted: new Subject<CellEditingStartedEvent>(),
      cellEditingStopped: new Subject<CellEditingStartedEvent>(),
      cellFocused: new Subject<CellFocusedEvent>(),
      headerFocused: new Subject<HeaderFocusedEvent>(),
    } as unknown as AgGridAngular;

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

  it('should be accessible', async () => {
    await expectAsync(gridWrapperNativeElement).toBeAccessible();
  });

  it('should set the min height', () => {
    gridWrapperFixture.componentRef.setInput('minHeight', 150);
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement
        .querySelector('div.sky-ag-grid')
        ?.getAttribute('style'),
    ).toEqual('--sky-ag-grid-min-height: 150px;');
  });

  it('should add .ag-header to the viewkeeper classes when the domLayout is set to autoHeight', () => {
    agGrid.gridOptions = { domLayout: 'autoHeight' };

    const autoHeightGridWrapperFixture = TestBed.createComponent(
      SkyAgGridWrapperComponent,
    );
    const autoHeightGridWrapperComponent =
      autoHeightGridWrapperFixture.componentInstance;
    autoHeightGridWrapperComponent.agGrid = agGrid;

    autoHeightGridWrapperFixture.detectChanges();

    expect(
      autoHeightGridWrapperComponent.viewkeeperClasses().indexOf('.ag-header'),
    ).not.toEqual(-1);
  });

  it('should add sky-ag-grid-layout-normal class when the domLayout is set to normal', () => {
    agGrid.gridOptions = { domLayout: 'normal' };

    const normalGridWrapperFixture = TestBed.createComponent(
      SkyAgGridWrapperComponent,
    );
    const autoHeightGridWrapperComponent =
      normalGridWrapperFixture.componentInstance;
    autoHeightGridWrapperComponent.agGrid = agGrid;

    normalGridWrapperFixture.detectChanges();

    expect(autoHeightGridWrapperComponent.isNormalLayout).toEqual(true);
  });

  it('should apply ag-theme', () => {
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('ag-theme-sky-data-grid-default');

    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('ag-theme-sky-data-grid-modern-light');

    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('ag-theme-sky-data-grid-default');
  });

  it('should get compact mode from theme', () => {
    expect(gridWrapperComponent.wrapperClasses()).toEqual(
      jasmine.arrayContaining(['ag-theme-sky-data-grid-default']),
    );

    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      ),
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.wrapperClasses()).toEqual(
      jasmine.arrayContaining(['ag-theme-sky-data-grid-modern-light-compact']),
    );
  });

  it('should get compact mode from input', () => {
    expect(gridWrapperComponent.wrapperClasses()).toEqual(
      jasmine.arrayContaining(['ag-theme-sky-data-grid-default']),
    );

    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.standard,
      ),
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.wrapperClasses()).toEqual(
      jasmine.arrayContaining(['ag-theme-sky-data-grid-modern-light']),
    );
    gridWrapperFixture.componentRef.setInput('compact', true);
    gridWrapperFixture.detectChanges();
    expect(gridWrapperComponent.wrapperClasses()).toEqual(
      jasmine.arrayContaining(['ag-theme-sky-data-grid-modern-light-compact']),
    );
  });

  it('should add and remove the cell editing class', () => {
    agGrid.cellEditingStarted.next({ colDef: {} } as CellEditingStartedEvent);
    agGrid.cellEditingStopped.next({} as CellEditingStoppedEvent);
    agGrid.cellEditingStarted.next({
      colDef: {
        type: 'test',
      },
    } as CellEditingStartedEvent);
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('sky-ag-grid-cell-editing-test');
    agGrid.cellEditingStopped.next({} as CellEditingStoppedEvent);
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).not.toHaveCssClass('sky-ag-grid-cell-editing-test');
    agGrid.cellEditingStarted.next({
      colDef: {
        type: ['test'],
      },
    } as CellEditingStartedEvent);
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('sky-ag-grid-cell-editing-test');
    agGrid.cellEditingStopped.next({} as CellEditingStoppedEvent);
    gridWrapperFixture.detectChanges();
    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).not.toHaveCssClass('sky-ag-grid-cell-editing-test');
  });

  it('should set focus to template cells when editing', () => {
    const spy = (agGrid.api.setFocusedCell as jasmine.Spy).and.stub();
    agGrid.cellEditingStarted.next({
      colDef: { type: SkyCellType.Template },
      rowIndex: 0,
      column: {} as AgColumn,
    } as unknown as CellEditingStartedEvent);
    gridWrapperFixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  describe('onGridKeydown', () => {
    let skyAgGridDivEl: HTMLElement;
    beforeEach(() => {
      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`,
      ) as HTMLElement;
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
      const col = {} as AgColumn;
      spyOn(gridAdapterService, 'setFocusedElementById');
      (agGrid.api.getEditingCells as jasmine.Spy).and.returnValue([
        { rowIndex: 0, column: col, rowPinned: undefined },
      ]);

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when tab is pressed but master/detail cells are being edited', () => {
      const col = {} as AgColumn;
      spyOn(gridAdapterService, 'setFocusedElementById');
      (agGrid.api.getGridOption as jasmine.Spy).and.returnValue(true);
      (agGrid.api.getEditingCells as jasmine.Spy).and.returnValue([]);
      (agGrid.api.forEachDetailGridInfo as jasmine.Spy).and.callFake((fn) => {
        fn(
          {
            api: {
              getEditingCells: (): any[] => {
                return [{ rowIndex: 0, column: col, rowPinned: '' }];
              },
            } as GridApi,
          } as DetailGridInfo,
          0,
        );
      });

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when a non-tab key is pressed', () => {
      spyOn(gridAdapterService, 'setFocusedElementById');
      (agGrid.api.getEditingCells as jasmine.Spy).and.returnValue([]);

      fireKeydownOnGrid('L', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it(`should move focus to the anchor after the grid when tab is pressed, no cells are being edited,
      and the grid was previously focused`, () => {
      (agGrid.api.getEditingCells as jasmine.Spy).and.returnValue([]);
      (agGrid.api.getGridOption as jasmine.Spy).and.returnValue(true);
      (agGrid.api.forEachDetailGridInfo as jasmine.Spy).and.callFake((fn) => {
        fn(
          {
            api: {
              getEditingCells: (): any[] => {
                return [];
              },
            } as GridApi,
          } as DetailGridInfo,
          0,
        );
      });
      spyOn(gridAdapterService, 'getFocusedElement').and.returnValue(
        skyAgGridDivEl,
      );
      spyOn(gridAdapterService, 'setFocusedElementById');

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).toHaveBeenCalledWith(
        gridWrapperNativeElement,
        gridWrapperComponent.afterAnchorId,
      );
    });

    it(`should move focus to the anchor before the grid when shift + tab is pressed, no cells are being edited,
      and the grid was previous focused`, () => {
      (agGrid.api.getEditingCells as jasmine.Spy).and.returnValue([]);
      spyOn(gridAdapterService, 'getFocusedElement').and.returnValue(
        skyAgGridDivEl,
      );
      spyOn(gridAdapterService, 'setFocusedElementById');

      fireKeydownOnGrid('Tab', true);

      expect(gridAdapterService.setFocusedElementById).toHaveBeenCalledWith(
        gridWrapperNativeElement,
        gridWrapperComponent.beforeAnchorId,
      );
    });
  });

  describe('onKeyUpEscape', () => {
    let skyAgGridDivEl: HTMLElement;
    beforeEach(() => {
      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`,
      ) as HTMLElement;
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
      fireKeyupEscape();
      expect(agGrid.api.stopEditing).toHaveBeenCalled();
    });
  });

  describe('onAnchorFocus', () => {
    function focusOnAnchor(
      anchorEl: HTMLElement,
      previousFocusedEl: HTMLElement,
    ): void {
      SkyAppTestUtility.fireDomEvent(anchorEl, 'focusin', {
        customEventInit: {
          relatedTarget: previousFocusedEl,
        },
      });

      gridWrapperFixture.detectChanges();
    }

    it('should shift focus to the first grid cell if it was not the previously focused element', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.afterAnchorId}`,
      ) as HTMLElement;
      const afterButtonEl = gridWrapperNativeElement.querySelector(
        '#button-after-grid',
      ) as HTMLElement;
      spyOn(gridWrapperNativeElement, 'contains').and.returnValue(true);
      const querySelector = spyOn(gridWrapperNativeElement, 'querySelector');
      focusOnAnchor(afterAnchorEl, afterButtonEl);
      expect(querySelector).toHaveBeenCalledWith(
        '.ag-tab-guard.ag-tab-guard-top',
      );
    });

    it('should not shift focus to the grid if it was the previously focused element', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.afterAnchorId}`,
      ) as HTMLElement;
      const gridEl = gridWrapperNativeElement.querySelector(
        `#${gridWrapperComponent.gridId}`,
      ) as HTMLElement;

      focusOnAnchor(afterAnchorEl, gridEl);

      expect(agGrid.api.setFocusedHeader).not.toHaveBeenCalled();
    });

    it('should track focus on header', () => {
      const column = new AgColumn({}, {}, 'name', true);

      agGrid.headerFocused.next({
        column: null,
        context: undefined,
      } as unknown as HeaderFocusedEvent);
      agGrid.headerFocused.next({
        column,
        context: agGrid.gridOptions?.context,
      } as unknown as HeaderFocusedEvent);
      agGrid.headerFocused.next({
        column: 'name',
        context: agGrid.gridOptions?.context,
      } as unknown as HeaderFocusedEvent);

      expect(agGrid.gridOptions?.context?.lastFocusedCell).toEqual({
        rowIndex: null,
        column: 'name',
      });
      const focusGridInnerElement = agGrid.gridOptions?.focusGridInnerElement;
      if (focusGridInnerElement) {
        expect(
          focusGridInnerElement({
            context: agGrid.gridOptions?.context,
            api: agGrid.api,
          } as FocusGridInnerElementParams),
        ).toBeTrue();
      } else {
        expect(focusGridInnerElement).toBeTruthy();
      }
    });

    it('should track focus on cells', () => {
      const column = new AgColumn({}, {}, 'name', true);
      const focusGridInnerElement = agGrid.gridOptions?.focusGridInnerElement;
      if (focusGridInnerElement) {
        expect(
          focusGridInnerElement({
            context: agGrid.gridOptions?.context,
            api: agGrid.api,
          } as FocusGridInnerElementParams),
        ).toBeFalse();
      } else {
        expect(focusGridInnerElement).toBeTruthy();
        return;
      }

      agGrid.cellFocused.next({
        rowIndex: null,
        column: null,
        context: undefined,
      } as unknown as CellFocusedEvent);
      agGrid.cellFocused.next({
        rowIndex: 0,
        column,
        context: agGrid.gridOptions?.context,
      } as unknown as CellFocusedEvent);
      agGrid.cellFocused.next({
        rowIndex: 0,
        column: 'name',
        context: agGrid.gridOptions?.context,
      } as unknown as CellFocusedEvent);

      expect(agGrid.gridOptions?.context?.lastFocusedCell).toEqual({
        rowIndex: 0,
        column: 'name',
      });
      expect(
        focusGridInnerElement({
          context: agGrid.gridOptions?.context,
          api: agGrid.api,
        } as FocusGridInnerElementParams),
      ).toBeTrue();
    });
  });
});

describe('SkyAgGridWrapperComponent via fixture', () => {
  let gridWrapperFixture: ComponentFixture<SkyAgGridFixtureComponent>;
  let gridWrapperNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  const getChildrenClassNames = (): string[] =>
    Array.from(
      gridWrapperNativeElement.querySelector('.ag-root')?.children || [],
    ).map((el) => el.classList[0]);

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureComponent],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideNoopAnimations(),
      ],
    });
  });

  it('should move the horizontal scroll based on enableTopScroll check, static data', async () => {
    TestBed.overrideProvider(EnableTopScroll, { useValue: true });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-body-horizontal-scroll',
      'ag-floating-top',
      'ag-body',
      'ag-sticky-top',
      'ag-sticky-bottom',
      'ag-floating-bottom',
      'ag-overlay',
    ]);
  });

  it('should move the horizontal scroll based on enableTopScroll check, async loading', async () => {
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-floating-top',
      'ag-body',
      'ag-sticky-top',
      'ag-sticky-bottom',
      'ag-floating-bottom',
      'ag-body-horizontal-scroll',
      'ag-overlay',
    ]);

    gridWrapperFixture.componentInstance.gridOptions.context = {
      enableTopScroll: true,
    };
    gridWrapperFixture.componentInstance.agGrid?.gridReady.emit();

    // Expect the scrollbar below the header.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-body-horizontal-scroll',
      'ag-floating-top',
      'ag-body',
      'ag-sticky-top',
      'ag-sticky-bottom',
      'ag-floating-bottom',
      'ag-overlay',
    ]);

    gridWrapperFixture.componentInstance.gridOptions.context = {
      enableTopScroll: false,
    };
    gridWrapperFixture.componentInstance.agGrid?.rowDataUpdated.emit();

    // Expect the scrollbar at the bottom.
    expect(getChildrenClassNames()).toEqual([
      'ag-header',
      'ag-floating-top',
      'ag-body',
      'ag-sticky-top',
      'ag-sticky-bottom',
      'ag-floating-bottom',
      'ag-body-horizontal-scroll',
      'ag-overlay',
    ]);
  });

  it('should have sky-ag-grid-text-selection class', async () => {
    TestBed.overrideProvider(Editable, { useValue: false });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).toHaveCssClass('sky-ag-grid-text-selection');
  });

  it('should not have sky-ag-grid-text-selection class when editing', async () => {
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    expect(
      gridWrapperNativeElement.querySelector('.sky-ag-grid'),
    ).not.toHaveCssClass('sky-ag-grid-text-selection');
  });

  it('should show inline help', fakeAsync(() => {
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    tick();

    expect(
      gridWrapperNativeElement.querySelector(
        `[col-id="name"] .sky-control-help`,
      ),
    ).toBeTruthy();
    expect(
      gridWrapperNativeElement.querySelector(
        `[col-id="value"] .sky-control-help`,
      ),
    ).toBeTruthy();
    expect(
      gridWrapperNativeElement
        .querySelector(`[col-id="value"] .sky-control-help`)
        ?.getAttribute('title'),
    ).toEqual('Current Value help');

    gridWrapperFixture.componentInstance.agGrid?.api.updateGridOptions({
      columnDefs: gridWrapperFixture.componentInstance.columnDefs.map((col) => {
        switch (col.field) {
          case 'name':
            return {
              ...col,
              headerComponentParams: {
                ...col.headerComponentParams,
                inlineHelpComponent: undefined,
              },
            };
          case 'value':
            return {
              ...col,
              headerComponentParams: {
                ...col.headerComponentParams,
                inlineHelpComponent: SecondInlineHelpComponent,
              },
            };
          case 'target':
            return {
              ...col,
              hide: true,
            };
          default:
            return col;
        }
      }),
    });
    gridWrapperFixture.detectChanges();
    tick(1000);

    expect(
      gridWrapperNativeElement.querySelector(
        `[col-id="name"] .sky-control-help`,
      ),
    ).toBeFalsy();
    expect(
      gridWrapperNativeElement.querySelector(
        `[col-id="value"] .sky-control-help`,
      ),
    ).toBeTruthy();
    expect(
      gridWrapperNativeElement
        .querySelector(`[col-id="value"] .sky-control-help`)
        ?.getAttribute('title'),
    ).toEqual('Current Value help replaced');
  }));

  describe('accessibility', () => {
    [false, true].forEach((enableTopScroll) => {
      it(`should be accessible in view mode ${
        enableTopScroll ? 'with' : 'without'
      } top scroll`, async () => {
        TestBed.overrideProvider(Editable, { useValue: false });
        TestBed.overrideProvider(EnableTopScroll, {
          useValue: enableTopScroll,
        });
        gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
        gridWrapperNativeElement = gridWrapperFixture.nativeElement;

        gridWrapperFixture.detectChanges();
        await gridWrapperFixture.whenStable();

        await expectAsync(gridWrapperNativeElement).toBeAccessible();
      });
    });

    it(`should be accessible in edit mode`, async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      await expectAsync(gridWrapperNativeElement).toBeAccessible();
    });

    it(`should be accessible in edit mode, lookup field single mode`, async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      expect(
        gridWrapperFixture.componentInstance.agGrid?.api.isAnimationFrameQueueEmpty(),
      ).toBeTrue();
      gridWrapperFixture.componentInstance.agGrid?.api.setColumnsVisible(
        gridWrapperFixture.componentInstance.columnDefs
          .filter(
            (col) =>
              typeof col.field === 'string' &&
              !['select', 'lookupSingle'].includes(col.field),
          )
          .map((col) => `${col.field}`),
        false,
      );
      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();
      gridWrapperFixture.componentInstance.agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'lookupSingle',
      });
      await firstValueFrom(
        gridWrapperFixture.componentInstance.agGrid?.cellEditingStarted ??
          EMPTY,
      );
      expect(
        gridWrapperFixture.componentInstance.agGrid?.api.getEditingCells(),
      ).toHaveSize(1);
      await expectAsync(
        gridWrapperNativeElement.ownerDocument.body,
      ).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });

    it(`should be accessible in edit mode, lookup field multiple mode`, async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      expect(
        gridWrapperFixture.componentInstance.agGrid?.api.isAnimationFrameQueueEmpty(),
      ).toBeTrue();
      gridWrapperFixture.componentInstance.agGrid?.api.setColumnsVisible(
        gridWrapperFixture.componentInstance.columnDefs
          .filter(
            (col) =>
              typeof col.field === 'string' &&
              !['select', 'lookupMultiple'].includes(col.field),
          )
          .map((col) => `${col.field}`),
        false,
      );
      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();
      gridWrapperFixture.componentInstance.agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'lookupMultiple',
      });
      await firstValueFrom(
        gridWrapperFixture.componentInstance.agGrid?.cellEditingStarted ??
          EMPTY,
      );
      expect(
        gridWrapperFixture.componentInstance.agGrid?.api.getEditingCells(),
      ).toHaveSize(1);
      await expectAsync(
        gridWrapperNativeElement.ownerDocument.body,
      ).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });
  });
});
