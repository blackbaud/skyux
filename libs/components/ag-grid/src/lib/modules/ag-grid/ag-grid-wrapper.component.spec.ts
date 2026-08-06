import { Component, signal, viewChild } from '@angular/core';
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

import { AgGridAngular } from 'ag-grid-angular';
import {
  AgColumn,
  CellFocusedEvent,
  DetailGridInfo,
  FocusGridInnerElementParams,
  GridApi,
  GridOptions,
  HeaderFocusedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, EMPTY, firstValueFrom } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';
import { SKY_AG_GRID_DATA } from './fixtures/ag-grid-data.fixture';
import { SkyAgGridTemplateCellFixtureComponent } from './fixtures/ag-grid-template-cell.component.fixture';
import {
  DomLayout,
  Editable,
  EnableTopScroll,
  SkyAgGridFixtureComponent,
} from './fixtures/ag-grid.component.fixture';
import { SecondInlineHelpComponent } from './fixtures/inline-help.component';
import { SkyCellType } from './types/cell-type';

@Component({
  selector: 'sky-ag-grid-viewkeeper-suppression-fixture',
  template: `
    <sky-ag-grid-wrapper>
      @if (showGrid()) {
        <ag-grid-angular [gridOptions]="gridOptions" [rowData]="gridData" />
      }
    </sky-ag-grid-wrapper>
  `,
  imports: [SkyAgGridWrapperComponent, AgGridAngular],
})
class SkyAgGridViewkeeperSuppressionFixtureComponent {
  public readonly showGrid = signal(true);
  public readonly agGridWrapper = viewChild(SkyAgGridWrapperComponent);
  public readonly gridData = SKY_AG_GRID_DATA;
  public gridOptions: GridOptions = {
    columnDefs: [{ field: 'name' }, { field: 'target' }],
    domLayout: 'autoHeight',
    context: {
      enableTopScroll: false,
    },
  };
}

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

  /**
   * AG Grid 36's `ScrollVisibleService` finalizes the horizontal scrollbar's
   * real visibility class/height via its own internal 500ms `setTimeout`,
   * running outside Angular's zone (per `provideSkyAgGridTesting`'s
   * `AG_GRID_UNDER_TEST` fix) and independent of `whenStable()`/animation
   * frames, so the assertions that depend on the scrollbar's settled
   * class/height need to wait past that timer.
   *
   * A bounded poll (checking the real DOM every ~25ms instead of sleeping a
   * fixed budget) was tried first, since it can settle as soon as the real
   * timer fires rather than guessing a delay. It was reverted after two
   * reproducible problems surfaced in this environment:
   * - Calling `detectChanges()`/`whenStable()` on every poll tick (instead
   *   of once) reproducibly triggered a stray, unrelated failure in a
   *   *different* spec file's `afterAll`
   *   (`ag-grid-data-manager-adapter.directive.spec.ts`) later in the same
   *   suite run - piling up dozens of settle cycles in one spec appears to
   *   destabilize zone/task tracking in a way a single settle call doesn't.
   * - Even after switching the poll to read only raw DOM state (no
   *   `detectChanges()`/`whenStable()` per tick), genuine non-convergence
   *   within a multi-second bound was still observed under sustained local
   *   system load, and the same cross-spec `afterAll` failure still
   *   reproduced intermittently.
   *
   * Given that, this uses a single fixed real-time wait with a wide margin
   * (1200ms - well over double the documented 500ms internal timer) plus one
   * settle cycle, matching the structure that was verified stable (multiple
   * full-suite runs, no cross-spec bleed) before the poll was tried.
   * Over-waiting only costs wall-clock time in this one spec; the wider
   * margin (vs. an earlier, thinner 600ms version of this same wait) is a
   * deliberate hedge against slower CI agents.
   */
  async function waitForScrollVisibleServiceToSettle(
    fixture: ComponentFixture<SkyAgGridFixtureComponent>,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    fixture.detectChanges();
    await fixture.whenStable();
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

    // See `waitForScrollVisibleServiceToSettle`'s declaration: AG Grid 36's
    // scrollbar visibility/height settles asynchronously via an internal
    // timer, so wait for it rather than asserting immediately.
    await waitForScrollVisibleServiceToSettle(gridWrapperFixture);

    const header = gridWrapperNativeElement.querySelector(
      '.ag-header',
    ) as HTMLElement;
    const scrollbar = gridWrapperNativeElement.querySelector(
      '.ag-body-horizontal-scroll',
    ) as HTMLElement;
    const pinnedTop = gridWrapperNativeElement.querySelector(
      '.ag-grid-pinned-top-rows',
    ) as HTMLElement;
    const skyAgGridDiv = gridWrapperNativeElement.querySelector(
      '.sky-ag-grid',
    ) as HTMLElement;

    // Which scrollbar mode renders is an OS/browser rendering detail, not
    // something this spec controls: ChromeHeadless renders classic
    // (reserved-width) scrollbars on CI's ubuntu-latest runners, but on a Mac
    // with the default `AppleShowScrollBars: Automatic` preference, it
    // renders overlay/auto-hiding scrollbars instead - both are real,
    // supported AG Grid states. The component observes the scrollbar element
    // itself (class + measured height), so the expected reservation can be
    // derived the same way on either branch.
    const reserved = scrollbar.classList.contains('ag-scrollbar-invisible')
      ? 0
      : scrollbar.offsetHeight;

    // The reservation and header-rows height are maintained as variables on
    // the SKY-owned wrapper div; the scrollbar is positioned from them in
    // CSS (see `_base.scss`), so no inline `top` is written.
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-top-scroll-height'),
    ).toEqual(`${reserved}px`);
    // The written value is the header rows plus the full headerRowBorder
    // (un-inflated separator + reservation) - `.ag-header`'s own inline
    // height and painted border can lag behind, so derive the expectation
    // the same way the component does.
    const headerRowsHeight = Array.from(
      header.querySelectorAll<HTMLElement>(':scope > .ag-header-row'),
    ).reduce((max, row) => Math.max(max, row.offsetTop + row.offsetHeight), 0);
    const separatorWidth =
      parseFloat(
        getComputedStyle(header).getPropertyValue(
          '--sky-ag-grid-header-row-border-width',
        ),
      ) || 0;
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-header-rows-height'),
    ).toEqual(`${headerRowsHeight + separatorWidth + reserved}px`);
    expect(pinnedTop.style.getPropertyValue('--ag-header-rows-height')).toEqual(
      `${headerRowsHeight + separatorWidth + reserved}px`,
    );
  });

  it('should reserve no space for overlay scrollbars and tolerate an unparseable border token', async () => {
    TestBed.overrideProvider(EnableTopScroll, { useValue: true });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();
    await waitForScrollVisibleServiceToSettle(gridWrapperFixture);

    const header = gridWrapperNativeElement.querySelector(
      '.ag-header',
    ) as HTMLElement;
    const scrollbar = gridWrapperNativeElement.querySelector(
      '.ag-body-horizontal-scroll',
    ) as HTMLElement;
    const pinnedTop = gridWrapperNativeElement.querySelector(
      '.ag-grid-pinned-top-rows',
    ) as HTMLElement;
    const skyAgGridDiv = gridWrapperNativeElement.querySelector(
      '.sky-ag-grid',
    ) as HTMLElement;

    // Simulate AG Grid classifying the scrollbar as overlay/auto-hiding.
    scrollbar.classList.add('ag-scrollbar-invisible');
    // Make the separator token unparseable so the numeric fallback engages.
    skyAgGridDiv.style.setProperty(
      '--sky-ag-grid-header-row-border-width',
      'not-a-length',
    );
    // Toggling the scrollbar's class/size alone doesn't reliably re-run the
    // apply subscription: on environments where the scrollbar is already
    // invisible (e.g. macOS with auto-hiding scrollbars), the mapped
    // reservation value never changes, so the resize observer's
    // `distinctUntilChanged` swallows the "change". A real header-height
    // change always gets through (see the header-height-changed spec below),
    // so use that to force the re-run instead.
    const initialHeaderHeight = header.offsetHeight;
    gridWrapperFixture.componentInstance
      .agGrid()
      ?.api.setGridOption('headerHeight', initialHeaderHeight + 50);

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    // Overlay scrollbars float above the rows and reserve no space.
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-top-scroll-height'),
    ).toEqual('0px');
    // The unparseable border token falls back to 0, so the header-rows
    // height is exactly the measured header rows plus the (zero)
    // reservations for both the border and the scrollbar.
    const headerRowsHeight = Array.from(
      header.querySelectorAll<HTMLElement>(':scope > .ag-header-row'),
    ).reduce((max, row) => Math.max(max, row.offsetTop + row.offsetHeight), 0);
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-header-rows-height'),
    ).toEqual(`${headerRowsHeight}px`);
    expect(pinnedTop.style.getPropertyValue('--ag-header-rows-height')).toEqual(
      `${headerRowsHeight}px`,
    );
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
    const skyAgGridDiv = gridWrapperNativeElement.querySelector(
      '.sky-ag-grid',
    ) as HTMLElement;

    // Without enableTopScroll the component leaves the scrollbar and the
    // wrapper variables alone entirely.
    expect(scrollbar.style.top).toEqual('');
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-top-scroll-height'),
    ).toEqual('');
    expect(
      skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-header-rows-height'),
    ).toEqual('');
  });

  it('should update the horizontal scroll position when the header height changes', async () => {
    TestBed.overrideProvider(EnableTopScroll, { useValue: true });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperNativeElement = gridWrapperFixture.nativeElement;

    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    const header = gridWrapperNativeElement.querySelector(
      '.ag-header',
    ) as HTMLElement;
    const skyAgGridDiv = gridWrapperNativeElement.querySelector(
      '.sky-ag-grid',
    ) as HTMLElement;
    const initialHeaderHeight = header.offsetHeight;

    gridWrapperFixture.componentInstance
      .agGrid()
      ?.api.setGridOption('headerHeight', initialHeaderHeight + 50);
    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    await waitForResizePosition();

    expect(header.offsetHeight).toBeGreaterThan(initialHeaderHeight);
    // Exact values are covered by the enableTopScroll spec above; here just
    // confirm the variable tracked the growth.
    expect(
      parseFloat(
        skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-header-rows-height'),
      ),
    ).toBeGreaterThan(initialHeaderHeight);
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

describe('SkyAgGridWrapperComponent viewkeeper suppression', () => {
  it('should keep viewkeeper classes empty after the grid source changes when suppressed', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridViewkeeperSuppressionFixtureComponent],
    });
    const fixture = TestBed.createComponent(
      SkyAgGridViewkeeperSuppressionFixtureComponent,
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const wrapperComponent = fixture.componentInstance.agGridWrapper();

    // arrange: suppress the wrapper's own viewkeeper, as the data manager
    // adapter does on registration.
    wrapperComponent?.viewkeeperSuppressed.set(true);
    fixture.detectChanges();
    expect(wrapperComponent?.viewkeeperClasses()).toEqual([]);

    // act: force a linkedSignal source change by destroying and recreating
    // the projected ag-grid-angular (as happens when a grid is rendered
    // behind an `@if`) while the same wrapper instance persists, and change
    // the context so the source genuinely differs.
    fixture.componentInstance.showGrid.set(false);
    fixture.detectChanges();
    fixture.componentInstance.gridOptions = {
      ...fixture.componentInstance.gridOptions,
      context: {
        enableTopScroll: true,
      },
    };
    fixture.componentInstance.showGrid.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    // assert: the suppression survived the source change.
    expect(fixture.componentInstance.agGridWrapper()).toBe(wrapperComponent);
    expect(wrapperComponent?.viewkeeperClasses()).toEqual([]);
  });

  it('should drop the grid api and layout class when the inner grid is removed', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridViewkeeperSuppressionFixtureComponent],
    });
    const fixture = TestBed.createComponent(
      SkyAgGridViewkeeperSuppressionFixtureComponent,
    );
    fixture.componentInstance.gridOptions = {
      ...fixture.componentInstance.gridOptions,
      domLayout: 'normal',
    };

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    const wrapperEl = fixture.nativeElement.querySelector(
      'sky-ag-grid-wrapper',
    );
    expect(wrapperEl).toHaveCssClass('sky-ag-grid-layout-normal');

    // act: remove the projected ag-grid-angular (as happens when a grid is
    // rendered behind an `@if`) while the wrapper instance persists.
    fixture.componentInstance.showGrid.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    // assert: the now-stale layout class doesn't stick around.
    expect(wrapperEl).not.toHaveCssClass('sky-ag-grid-layout-normal');
  });
});
