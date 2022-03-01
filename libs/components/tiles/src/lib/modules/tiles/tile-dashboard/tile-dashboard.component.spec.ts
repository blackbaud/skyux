import { QueryList } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject, of } from 'rxjs';

import { SkyTileDashboardColumnComponent } from '../tile-dashboard-column/tile-dashboard-column.component';
import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';

import { MockTileDashboardService } from './fixtures/mock-tile-dashboard.service';
import { MockSkyUIConfigService } from './fixtures/mock-ui-config.service';
import { Tile1TestComponent } from './fixtures/tile1.component.fixture';
import { Tile2TestComponent } from './fixtures/tile2.component.fixture';
import { TileTestContext } from './fixtures/tile-context.fixture';
import { SkyTileDashboardFixturesModule } from './fixtures/tile-dashboard-fixtures.module';
import { TileDashboardOnPushTestComponent } from './fixtures/tile-dashboard-on-push.component.fixture';
import { TileDashboardTestComponent } from './fixtures/tile-dashboard.component.fixture';
import { SkyTileDashboardComponent } from './tile-dashboard.component';
import { SkyTileDashboardService } from './tile-dashboard.service';

describe('Tile dashboard component', () => {
  let mockTileDashboardService: MockTileDashboardService;
  let mockUIConfigService: MockSkyUIConfigService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockTileDashboardService = new MockTileDashboardService();
    mockUIConfigService = new MockSkyUIConfigService();
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyTileDashboardService,
          useValue: mockTileDashboardService,
        },
        {
          provide: SkyUIConfigService,
          useValue: mockUIConfigService,
        },
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
      imports: [NoopAnimationsModule, SkyTileDashboardFixturesModule],
    });
  });

  it('should update tile order when tile moves within a column', fakeAsync(() => {
    const fixture = TestBed.overrideComponent(SkyTileDashboardComponent, {
      add: {
        providers: [
          {
            provide: SkyTileDashboardService,
            useValue: mockTileDashboardService,
          },
        ],
      },
    }).createComponent(TileDashboardTestComponent);

    const newConfig: SkyTileDashboardConfig = {
      tiles: [
        {
          id: 'tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'tile-2',
          componentType: Tile2TestComponent,
        },
      ],
      layout: {
        multiColumn: [
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false,
              },
              {
                id: 'tile-1',
                isCollapsed: false,
              },
            ],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: false,
            },
            {
              id: 'tile-1',
              isCollapsed: false,
            },
          ],
        },
      },
    };

    fixture.detectChanges();
    tick();

    mockTileDashboardService.configChange.emit(newConfig);

    fixture.detectChanges();
    tick();

    expect(fixture.componentInstance.dashboardConfig).toEqual(newConfig);
  }));

  it('should not allow a new config to be set by the parent once initialized', fakeAsync(() => {
    const fixture = TestBed.overrideComponent(SkyTileDashboardComponent, {
      add: {
        providers: [
          {
            provide: SkyTileDashboardService,
            useValue: mockTileDashboardService,
          },
        ],
      },
    }).createComponent(TileDashboardTestComponent);

    const cmp = fixture.componentInstance;
    const initialConfig = cmp.dashboardConfig;
    const newConfig: SkyTileDashboardConfig = {
      tiles: [
        {
          id: 'tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'tile-2',
          componentType: Tile2TestComponent,
        },
      ],
      layout: {
        multiColumn: [
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false,
              },
              {
                id: 'tile-1',
                isCollapsed: false,
              },
            ],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: false,
            },
            {
              id: 'tile-1',
              isCollapsed: false,
            },
          ],
        },
      },
    };

    const initSpy = spyOn(mockTileDashboardService, 'init');

    fixture.detectChanges();
    tick();

    expect(initSpy).toHaveBeenCalledWith(
      initialConfig,
      jasmine.any(QueryList),
      jasmine.any(SkyTileDashboardColumnComponent),
      undefined
    );

    initSpy.calls.reset();

    cmp.dashboardConfig = newConfig;

    fixture.detectChanges();
    tick();

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it(`should release resources when the component is destroyed`, () => {
    const fixture = TestBed.overrideComponent(SkyTileDashboardComponent, {
      add: {
        providers: [
          {
            provide: SkyTileDashboardService,
            useValue: mockTileDashboardService,
          },
        ],
      },
    }).createComponent(TileDashboardTestComponent);

    const destroySpy = spyOn(mockTileDashboardService, 'destroy');

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it(`should display columns with equal widths despite a tile's contents`, fakeAsync(() => {
    const fixture = TestBed.createComponent(TileDashboardTestComponent);

    fixture.detectChanges();
    tick();

    const el = fixture.elementRef.nativeElement;

    const firstTileContentEl = el.querySelectorAll('sky-tile-content')[0];
    const wideEl = document.createElement('div');

    // Force the first tile's contents to be wider than the second tile's.
    wideEl.style.width = window.innerWidth + 'px';

    firstTileContentEl.appendChild(wideEl);

    const tileEls = el.querySelectorAll('.sky-tile-dashboard-column');

    expect(tileEls[0].offsetWidth).toEqual(tileEls[1].offsetWidth);
  }));

  it(`should allow context to be provided to a tile`, fakeAsync(() => {
    const fixture = TestBed.createComponent(TileDashboardTestComponent);

    fixture.detectChanges();
    tick();

    const cmp = fixture.componentInstance;

    const tileComponentRef =
      cmp.dashboardComponent['dashboardService'].getTileComponent(
        'sky-test-tile-2'
      );

    expect(tileComponentRef.instance.context.id).toBe(3);
  }));

  it(`should render tiles properly when the parent component's change detection strategy is OnPush`, fakeAsync(() => {
    const fixture = TestBed.createComponent(TileDashboardOnPushTestComponent);

    fixture.detectChanges();
    tick();

    // For some reason we have to run change detection twice for the tile to actually render.
    fixture.detectChanges();
    tick();

    const cmp = fixture.componentInstance;

    const tileComponentRef =
      cmp.dashboardComponent['dashboardService'].getTileComponent(
        'sky-test-tile-1'
      );

    const tileEl = tileComponentRef.location.nativeElement;

    expect(tileEl.querySelector('.sky-tile-title')).toHaveText('Tile 1');
  }));

  it('should expand all tiles when the message stream sends the expand all message type', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileDashboardTestComponent);

    fixture.detectChanges();
    tick();

    const cmp = fixture.componentInstance;
    spyOn(cmp.dashboardComponent.configChange, 'emit').and.callThrough();
    spyOn(mockUIConfigService, 'getConfig').and.callFake(() => {
      return of();
    });
    spyOn(mockUIConfigService, 'setConfig').and.callThrough();
    cmp.enableStickySettings();
    fixture.detectChanges();

    expect(
      document.querySelector('.sky-test-tile-1 .sky-tile-collapsed')
    ).not.toBeNull();

    cmp.expandAll();
    fixture.detectChanges();
    tick();

    fixture.detectChanges();
    tick();

    const expectedDashboardConfig = {
      tiles: [
        {
          id: 'sky-test-tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'sky-test-tile-2',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
        {
          id: 'sky-test-tile-3',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
        {
          id: 'sky-test-tile-4',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
      ],
      layout: {
        singleColumn: {
          tiles: [
            {
              id: 'sky-test-tile-2',
              isCollapsed: false,
            },
            {
              id: 'sky-test-tile-1',
              isCollapsed: false,
            },
            {
              id: 'sky-test-tile-3',
              isCollapsed: false,
            },
            {
              id: 'sky-test-tile-4',
              isCollapsed: false,
            },
          ],
        },
        multiColumn: [
          {
            tiles: [
              {
                id: 'sky-test-tile-1',
                isCollapsed: false,
              },
              {
                id: 'sky-test-tile-3',
                isCollapsed: false,
              },
              {
                id: 'sky-test-tile-4',
                isCollapsed: false,
              },
            ],
          },
          {
            tiles: [
              {
                id: 'sky-test-tile-2',
                isCollapsed: false,
              },
            ],
          },
        ],
      },
    };

    expect(
      document.querySelector('.sky-test-tile-1 .sky-tile-collapsed')
    ).toBeNull();
    expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);
    expect(cmp.dashboardComponent.configChange.emit).toHaveBeenCalled();
    expect(mockUIConfigService.setConfig).toHaveBeenCalled();
  }));

  it('should collapse all tiles when the message stream sends the collapse all message type', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileDashboardTestComponent);

    fixture.detectChanges();
    tick();

    const cmp = fixture.componentInstance;
    spyOn(cmp.dashboardComponent.configChange, 'emit').and.callThrough();
    spyOn(mockUIConfigService, 'setConfig').and.callThrough();

    expect(
      document.querySelector('.sky-test-tile-1 .sky-tile-collapsed')
    ).toBeNull();

    cmp.collapseAll();
    fixture.detectChanges();
    tick();

    fixture.detectChanges();
    tick();

    const expectedDashboardConfig = {
      tiles: [
        {
          id: 'sky-test-tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'sky-test-tile-2',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
        {
          id: 'sky-test-tile-3',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
        {
          id: 'sky-test-tile-4',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3,
              },
            },
          ],
        },
      ],
      layout: {
        singleColumn: {
          tiles: [
            {
              id: 'sky-test-tile-2',
              isCollapsed: true,
            },
            {
              id: 'sky-test-tile-1',
              isCollapsed: true,
            },
            {
              id: 'sky-test-tile-3',
              isCollapsed: true,
            },
            {
              id: 'sky-test-tile-4',
              isCollapsed: true,
            },
          ],
        },
        multiColumn: [
          {
            tiles: [
              {
                id: 'sky-test-tile-1',
                isCollapsed: true,
              },
              {
                id: 'sky-test-tile-3',
                isCollapsed: true,
              },
              {
                id: 'sky-test-tile-4',
                isCollapsed: true,
              },
            ],
          },
          {
            tiles: [
              {
                id: 'sky-test-tile-2',
                isCollapsed: true,
              },
            ],
          },
        ],
      },
    };

    expect(
      document.querySelector('.sky-test-tile-1 .sky-tile-collapsed')
    ).not.toBeNull();
    expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);
    expect(cmp.dashboardComponent.configChange.emit).toHaveBeenCalled();
    expect(mockUIConfigService.setConfig).not.toHaveBeenCalled();
  }));

  it('should pass accessibility', async () => {
    const fixture = TestBed.createComponent(TileDashboardOnPushTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
