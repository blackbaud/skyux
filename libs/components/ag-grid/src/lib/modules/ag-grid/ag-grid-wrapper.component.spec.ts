import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
  SkyThemeSpacing,
} from '@skyux/theme';

import {
  AgColumn,
  CellFocusedEvent,
  DetailGridInfo,
  FocusGridInnerElementParams,
  GridApi,
  HeaderFocusedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, EMPTY, firstValueFrom } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';
import { SkyAgGridTemplateCellFixtureComponent } from './fixtures/ag-grid-template-cell.component.fixture';
import {
  DomLayout,
  Editable,
  EnableTopScroll,
  SkyAgGridFixtureComponent,
} from './fixtures/ag-grid.component.fixture';
import { SecondInlineHelpComponent } from './fixtures/inline-help.component';
import { SkyCellType } from './types/cell-type';

describe('SkyAgGridWrapperComponent', () => {
  let gridWrapperFixture: ComponentFixture<SkyAgGridWrapperComponent>;
  let gridWrapperComponent: SkyAgGridWrapperComponent;
  let gridWrapperNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

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
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    gridWrapperFixture = TestBed.createComponent(SkyAgGridWrapperComponent);
    gridWrapperComponent = gridWrapperFixture.componentInstance;
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

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
});

describe('SkyAgGridWrapperComponent via fixture', () => {
  let gridWrapperFixture: ComponentFixture<SkyAgGridFixtureComponent>;
  let gridWrapperNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  async function waitForResizePosition(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

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
      ],
    });
  });

  it('should position the horizontal scroll below the header when enableTopScroll is true', async () => {
    TestBed.overrideProvider(EnableTopScroll, { useValue: true });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    const header = gridWrapperNativeElement.querySelector(
      '.ag-header',
    ) as HTMLElement;
    const scrollbar = gridWrapperNativeElement.querySelector(
      '.ag-body-horizontal-scroll',
    ) as HTMLElement;
    const pinnedTopRows = gridWrapperNativeElement.querySelector(
      '.ag-grid-pinned-top-rows',
    ) as HTMLElement;

    expect(scrollbar.style.top).toEqual(`${header.offsetHeight}px`);
    expect(scrollbar.style.bottom).toEqual('');

    if (!scrollbar.classList.contains('ag-scrollbar-invisible')) {
      const scrollbarHeight = parseFloat(scrollbar.style.height) || 0;
      expect(
        pinnedTopRows.style.getPropertyValue('--ag-header-rows-height'),
      ).toEqual(`${header.offsetHeight + scrollbarHeight}px`);
    }
  });

  it('should not touch the horizontal scroll position when enableTopScroll is false', async () => {
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    const scrollbar = gridWrapperNativeElement.querySelector(
      '.ag-body-horizontal-scroll',
    ) as HTMLElement;

    // `top` is the only property SkyAgGridWrapperComponent ever sets on this
    // element; `bottom` may legitimately be managed by AG Grid itself (e.g.
    // its own auto-hiding-scrollbar positioning), independent of this feature.
    expect(scrollbar.style.top).toEqual('');
  });

  it('should update the horizontal scroll position when the header height changes', async () => {
    TestBed.overrideProvider(EnableTopScroll, { useValue: true });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    const scrollbar = gridWrapperNativeElement.querySelector(
      '.ag-body-horizontal-scroll',
    ) as HTMLElement;
    const header = gridWrapperNativeElement.querySelector(
      '.ag-header',
    ) as HTMLElement;
    const initialHeaderHeight = header.offsetHeight;

    gridWrapperFixture.componentInstance
      .agGrid()
      ?.api.setGridOption('headerHeight', initialHeaderHeight + 50);
    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    expect(header.offsetHeight).toBeGreaterThan(initialHeaderHeight);
    expect(scrollbar.style.top).toEqual(`${header.offsetHeight}px`);
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

    gridWrapperFixture.componentInstance.agGrid()?.api.updateGridOptions({
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

  describe('cell editing state', () => {
    beforeEach(async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();
    });

    it('should add and remove the cell editing class for a single-type column', async () => {
      const agGrid = gridWrapperFixture.componentInstance.agGrid();

      const cellEditingStarted = firstValueFrom(
        agGrid?.cellEditingStarted ?? EMPTY,
      );
      agGrid?.api.startEditingCell({ rowIndex: 0, colKey: 'nickname' });
      await cellEditingStarted;
      gridWrapperFixture.detectChanges();

      expect(
        gridWrapperNativeElement.querySelector('.sky-ag-grid'),
      ).toHaveCssClass(`sky-ag-grid-cell-editing-${SkyCellType.Text}`);

      const cellEditingStopped = firstValueFrom(
        agGrid?.cellEditingStopped ?? EMPTY,
      );
      agGrid?.api.stopEditing();
      await cellEditingStopped;
      gridWrapperFixture.detectChanges();

      expect(
        gridWrapperNativeElement.querySelector('.sky-ag-grid'),
      ).not.toHaveCssClass(`sky-ag-grid-cell-editing-${SkyCellType.Text}`);
    });

    it('should add a cell editing class for each type in a multi-type column', async () => {
      const agGrid = gridWrapperFixture.componentInstance.agGrid();

      const cellEditingStarted = firstValueFrom(
        agGrid?.cellEditingStarted ?? EMPTY,
      );
      agGrid?.api.startEditingCell({ rowIndex: 0, colKey: 'validDate' });
      await cellEditingStarted;
      gridWrapperFixture.detectChanges();

      const skyAgGridEl =
        gridWrapperNativeElement.querySelector('.sky-ag-grid');
      expect(skyAgGridEl).toHaveCssClass(
        `sky-ag-grid-cell-editing-${SkyCellType.Date}`,
      );
      expect(skyAgGridEl).toHaveCssClass(
        `sky-ag-grid-cell-editing-${SkyCellType.Validator}`,
      );
    });
  });

  describe('cell editing state, template cell', () => {
    let templateFixture: ComponentFixture<SkyAgGridTemplateCellFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyAgGridTemplateCellFixtureComponent],
      });
    });

    it('should set focus to template cells when editing', async () => {
      templateFixture = TestBed.createComponent(
        SkyAgGridTemplateCellFixtureComponent,
      );
      templateFixture.detectChanges();
      await templateFixture.whenStable();

      const agGrid = templateFixture.componentInstance.agGrid();
      const cellEditingStarted = firstValueFrom(
        agGrid?.cellEditingStarted ?? EMPTY,
      );
      agGrid?.api.startEditingCell({ rowIndex: 0, colKey: 'action' });
      await cellEditingStarted;
      templateFixture.detectChanges();

      const focusedCell = agGrid?.api.getFocusedCell();
      expect(focusedCell?.rowIndex).toBe(0);
      expect(focusedCell?.column.getColId()).toBe('action');
    });
  });

  describe('viewkeeper classes', () => {
    it('should add .ag-header to the viewkeeper classes when the domLayout is set to autoHeight', async () => {
      TestBed.overrideProvider(DomLayout, { useValue: 'autoHeight' });
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      const gridWrapperComponent =
        gridWrapperFixture.componentInstance.agGridWrapper();

      expect(
        gridWrapperComponent?.viewkeeperClasses().indexOf('.ag-header'),
      ).not.toEqual(-1);
    });

    it('should add sky-ag-grid-layout-normal class when the domLayout is set to normal', async () => {
      TestBed.overrideProvider(DomLayout, { useValue: 'normal' });
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      const gridWrapperComponent =
        gridWrapperFixture.componentInstance.agGridWrapper();

      expect(
        gridWrapperNativeElement.querySelector('sky-ag-grid-wrapper'),
      ).toHaveCssClass('sky-ag-grid-layout-normal');
      expect(
        gridWrapperComponent
          ?.viewkeeperClasses()
          .indexOf('.ag-body-horizontal-scroll'),
      ).toEqual(-1);
    });
  });

  describe('onGridKeydown', () => {
    let gridAdapterService: SkyAgGridAdapterService;
    let api: GridApi;
    let skyAgGridDivEl: HTMLElement;
    let skyAgGridWrapperEl: HTMLElement;

    beforeEach(async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      gridAdapterService = TestBed.inject(SkyAgGridAdapterService);
      api = gridWrapperFixture.componentInstance.agGrid()?.api as GridApi;
      spyOn(api, 'getEditingCells').and.returnValue([]);
      spyOn(api, 'getGridOption').and.returnValue(false);
      spyOn(api, 'forEachDetailGridInfo');

      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `div[id^="sky-ag-grid-"]`,
      ) as HTMLElement;
      // `SkyAgGridWrapperComponent` passes its own host element (not the
      // outer fixture's root) to `setFocusedElementById`.
      skyAgGridWrapperEl = gridWrapperNativeElement.querySelector(
        'sky-ag-grid-wrapper',
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
      (api.getEditingCells as jasmine.Spy).and.returnValue([
        { rowIndex: 0, column: col, rowPinned: undefined },
      ]);

      fireKeydownOnGrid('Tab', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it('should not move focus when tab is pressed but master/detail cells are being edited', () => {
      const col = {} as AgColumn;
      spyOn(gridAdapterService, 'setFocusedElementById');
      (api.getGridOption as jasmine.Spy).and.returnValue(true);
      (api.forEachDetailGridInfo as jasmine.Spy).and.callFake((fn) => {
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

      fireKeydownOnGrid('L', false);

      expect(gridAdapterService.setFocusedElementById).not.toHaveBeenCalled();
    });

    it(`should move focus to the anchor after the grid when tab is pressed, no cells are being edited,
      and the grid was previously focused`, () => {
      (api.getGridOption as jasmine.Spy).and.returnValue(true);
      (api.forEachDetailGridInfo as jasmine.Spy).and.callFake((fn) => {
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
        skyAgGridWrapperEl,
        jasmine.stringContaining('sky-ag-grid-nav-anchor-after-'),
      );
    });

    it(`should move focus to the anchor before the grid when shift + tab is pressed, no cells are being edited,
      and the grid was previous focused`, () => {
      spyOn(gridAdapterService, 'getFocusedElement').and.returnValue(
        skyAgGridDivEl,
      );
      spyOn(gridAdapterService, 'setFocusedElementById');

      fireKeydownOnGrid('Tab', true);

      expect(gridAdapterService.setFocusedElementById).toHaveBeenCalledWith(
        skyAgGridWrapperEl,
        jasmine.stringContaining('sky-ag-grid-nav-anchor-before-'),
      );
    });
  });

  describe('onKeyUpEscape', () => {
    let api: GridApi;
    let skyAgGridDivEl: HTMLElement;

    beforeEach(async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      api = gridWrapperFixture.componentInstance.agGrid()?.api as GridApi;
      spyOn(api, 'stopEditing');

      skyAgGridDivEl = gridWrapperNativeElement.querySelector(
        `div[id^="sky-ag-grid-"]`,
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

    it('should stop editing when escape is pressed', () => {
      fireKeyupEscape();
      expect(api.stopEditing).toHaveBeenCalled();
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

    beforeEach(async () => {
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();
    });

    it('should shift focus to the first grid cell if it was not the previously focused element', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `span[id^="sky-ag-grid-nav-anchor-after-"]`,
      ) as HTMLElement;
      const gridEl = gridWrapperNativeElement.querySelector(
        `div[id^="sky-ag-grid-"]`,
      ) as HTMLElement;
      const outsideButton = document.createElement('button');
      document.body.append(outsideButton);

      focusOnAnchor(afterAnchorEl, outsideButton);

      // Focusing the tab guard hands focus off to AG Grid's own keyboard
      // navigation, which lands on the first focusable element in the grid
      // (rather than staying on the tab guard itself).
      expect(gridEl.contains(document.activeElement)).toBeTrue();

      outsideButton.remove();
    });

    it('should not shift focus to the grid if it was the previously focused element', () => {
      const afterAnchorEl = gridWrapperNativeElement.querySelector(
        `span[id^="sky-ag-grid-nav-anchor-after-"]`,
      ) as HTMLElement;
      const gridEl = gridWrapperNativeElement.querySelector(
        `div[id^="sky-ag-grid-"]`,
      ) as HTMLElement;

      focusOnAnchor(afterAnchorEl, gridEl);

      expect(
        gridWrapperNativeElement.querySelector(
          '.ag-tab-guard.ag-tab-guard-top',
        ),
      ).not.toBe(document.activeElement);
    });

    it('should track focus on header', async () => {
      const agGrid = gridWrapperFixture.componentInstance.agGrid();
      const headerCell = gridWrapperNativeElement.querySelector(
        '.ag-header-cell[col-id="name"]',
      ) as HTMLElement;

      // AG Grid dispatches `headerFocused` asynchronously (via a batched
      // `setTimeout` that isn't tracked by the Angular zone), so wait on the
      // event itself rather than `whenStable()`.
      const headerFocused = firstValueFrom(agGrid?.headerFocused ?? EMPTY);
      headerCell.focus();
      await headerFocused;
      gridWrapperFixture.detectChanges();

      expect(agGrid?.gridOptions?.context?.['lastFocusedCell']).toEqual({
        rowIndex: null,
        column: 'name',
      });

      const focusGridInnerElement = agGrid?.gridOptions?.focusGridInnerElement;
      expect(
        focusGridInnerElement?.({
          context: agGrid?.gridOptions?.context,
          api: agGrid?.api,
        } as FocusGridInnerElementParams),
      ).toBeTrue();
    });

    it('should track focus on cells', async () => {
      const agGrid = gridWrapperFixture.componentInstance.agGrid();

      // AG Grid dispatches `cellFocused` asynchronously (via a batched
      // `setTimeout` that isn't tracked by the Angular zone), so wait on the
      // event itself rather than `whenStable()`.
      const cellFocused = firstValueFrom(agGrid?.cellFocused ?? EMPTY);
      agGrid?.api.setFocusedCell(0, 'name');
      await cellFocused;
      gridWrapperFixture.detectChanges();

      expect(agGrid?.gridOptions?.context?.['lastFocusedCell']).toEqual({
        rowIndex: 0,
        column: 'name',
      });

      const focusGridInnerElement = agGrid?.gridOptions?.focusGridInnerElement;
      expect(
        focusGridInnerElement?.({
          context: agGrid?.gridOptions?.context,
          api: agGrid?.api,
        } as FocusGridInnerElementParams),
      ).toBeTrue();
    });

    it('should fall back to a string column and empty context for malformed focus events', () => {
      // Real AG Grid always provides a Column instance and a `context` object
      // on these events; this only exercises the defensive fallbacks for
      // inputs the real grid won't otherwise produce.
      const agGrid = gridWrapperFixture.componentInstance.agGrid();
      const setGridOption =
        agGrid && spyOn(agGrid.api, 'setGridOption').and.callThrough();

      expect(() => {
        agGrid?.headerFocused.emit({
          column: 'name',
          context: undefined,
          api: agGrid?.api,
        } as unknown as HeaderFocusedEvent);
      }).not.toThrow();
      expect(() => {
        agGrid?.cellFocused.emit({
          rowIndex: 0,
          column: 'name',
          context: undefined,
          api: agGrid?.api,
        } as unknown as CellFocusedEvent);
      }).not.toThrow();
      gridWrapperFixture.detectChanges();

      expect(setGridOption).toHaveBeenCalledWith(
        'context',
        jasmine.objectContaining({
          lastFocusedCell: { rowIndex: 0, column: 'name' },
        }),
      );
    });
  });

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

    it(`should be accessible when a header cell has focus`, async () => {
      TestBed.overrideProvider(Editable, { useValue: false });
      gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridWrapperNativeElement = gridWrapperFixture.nativeElement;

      gridWrapperFixture.detectChanges();
      await gridWrapperFixture.whenStable();

      const headerCell = gridWrapperNativeElement.querySelector(
        '.ag-header-cell[col-id="name"]',
      ) as HTMLElement;
      headerCell.focus();
      gridWrapperFixture.detectChanges();

      expect(gridWrapperNativeElement.ownerDocument.activeElement).toBe(
        headerCell,
      );
      await expectAsync(gridWrapperNativeElement).toBeAccessible();

      // The axe-core test does not assert the contrast for the focus ring, it
      // only checks contrast between text and backgrounds, so this test is also
      // asserting that the focus shadow is our color.
      const skyAgGridEl = gridWrapperNativeElement.querySelector(
        '.sky-ag-grid',
      ) as HTMLElement;
      const styleResolver = document.createElement('span');
      styleResolver.style.color =
        'var(--sky-override-ag-grid-focus-border-color, var(--sky-color-border-input-focus))';
      skyAgGridEl.append(styleResolver);
      const focusBorderColor = getComputedStyle(styleResolver).color;
      expect(focusBorderColor).toBeTruthy();
      styleResolver.remove();

      const headerCellFocusShadow = getComputedStyle(headerCell).boxShadow;
      expect(headerCellFocusShadow).toContain(focusBorderColor);
      expect(headerCellFocusShadow).toContain('0px 0px 0px 2px');
      expect(headerCellFocusShadow).toContain('inset');
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

      const agGrid = gridWrapperFixture.componentInstance.agGrid();
      expect(agGrid?.api.isAnimationFrameQueueEmpty()).toBeTrue();
      agGrid?.api.setColumnsVisible(
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
      const cellEditingStarted = firstValueFrom(
        agGrid?.cellEditingStarted ?? EMPTY,
      );
      agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'lookupSingle',
      });
      await cellEditingStarted;
      expect(agGrid?.api.getEditingCells()).toHaveSize(1);
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

      const agGrid = gridWrapperFixture.componentInstance.agGrid();
      expect(agGrid?.api.isAnimationFrameQueueEmpty()).toBeTrue();
      agGrid?.api.setColumnsVisible(
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
      const cellEditingStarted = firstValueFrom(
        agGrid?.cellEditingStarted ?? EMPTY,
      );
      agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'lookupMultiple',
      });
      await cellEditingStarted;
      expect(agGrid?.api.getEditingCells()).toHaveSize(1);
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
