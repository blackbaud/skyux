import { EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { DragulaOptions, DragulaService, Group } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs';

import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';
import { SkyTileDashboardComponent } from '../tile-dashboard/tile-dashboard.component';
import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';
import { SKY_TILE_TITLE_ID } from '../tile/tile-title-id-token';
import { SkyTileComponent } from '../tile/tile.component';
import { SkyTilesModule } from '../tiles.module';

import { MockDragulaService } from './fixtures/mock-dragula.service';
import { MockSkyUIConfigService } from './fixtures/mock-ui-config.service';
import { TileTestContext } from './fixtures/tile-context.fixture';
import { SkyTileDashboardFixturesModule } from './fixtures/tile-dashboard-fixtures.module';
import { TileDashboardTestComponent } from './fixtures/tile-dashboard.component.fixture';
import { Tile1TestComponent } from './fixtures/tile1.component.fixture';
import { Tile2TestComponent } from './fixtures/tile2.component.fixture';

describe('Tile dashboard service', () => {
  let dashboardConfig: SkyTileDashboardConfig;
  let dashboardService: SkyTileDashboardService;
  let mockDragulaService: MockDragulaService;
  let mediaQueryController: SkyMediaQueryTestingController;
  let mockUIConfigService: MockSkyUIConfigService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  function createDashboardTestComponent(): ComponentFixture<TileDashboardTestComponent> {
    return TestBed.createComponent(TileDashboardTestComponent);
  }

  beforeEach(() => {
    mockUIConfigService = new MockSkyUIConfigService();
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
      imports: [
        NoopAnimationsModule,
        SkyTileDashboardFixturesModule,
        SkyTilesModule,
      ],
      providers: [
        { provide: DragulaService, useClass: MockDragulaService },
        provideSkyMediaQueryTesting(),
        { provide: SkyUIConfigService, useValue: mockUIConfigService },
        SkyTileDashboardService,
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        { provide: SKY_TILE_TITLE_ID, useValue: '1' },
      ],
    });

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
    mockDragulaService = TestBed.inject(DragulaService) as MockDragulaService;
    dashboardService = TestBed.inject(SkyTileDashboardService);

    dashboardConfig = {
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
                id: 'tile-1',
                isCollapsed: false,
              },
            ],
          },
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false,
              },
            ],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: true,
            },
            {
              id: 'tile-1',
              isCollapsed: true,
            },
          ],
        },
      },
    };
  });

  it('should emit the config change event when a tile is moved', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    const dashboardService = fixture.debugElement
      .query(By.directive(SkyTileDashboardComponent))
      .injector.get(SkyTileDashboardService);
    let configChanged = false;

    fixture.componentInstance.settingsKey = 'defaultSettings';

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        configChanged = true;

        const expectedConfig: SkyTileDashboardConfig = {
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
                  isCollapsed: true,
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
                  {
                    id: 'sky-test-tile-1',
                    isCollapsed: true,
                  },
                ],
              },
            ],
          },
        };

        expect(config).toEqual(expectedConfig);
      },
    );

    fixture.detectChanges();
    tick();

    const el = fixture.nativeElement;

    const columnEls = el.querySelectorAll('.sky-tile-dashboard-column');

    columnEls[1].appendChild(columnEls[0].querySelector('div.sky-test-tile-1'));

    mockDragulaService.drop().next({});
    tick();

    expect(configChanged).toBe(true);
  }));

  it("should set the tile's grab handle as the drag handle", fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const tile: Element = fixture.nativeElement.querySelector(
      'div.sky-test-tile-1',
    );
    const handle = tile.querySelector('.sky-tile-grab-handle sky-icon-svg');
    const setOptionsSpy = spyOn(mockDragulaService, 'createGroup').and.callFake(
      (name: string, options: DragulaOptions) => {
        if (options.moves && handle) {
          const result = options.moves(tile, undefined, handle);
          expect(result).toBe(true);
        } else {
          fail('Missing moves handler and/or handle');
        }
        return {} as Group;
      },
    );

    TestBed.runInInjectionContext(() => {
      return new SkyTileDashboardService();
    });

    expect(setOptionsSpy).toHaveBeenCalled();
  }));

  function testIntercolumnNavigation(
    fixture: ComponentFixture<TileDashboardTestComponent>,
    keyName: string,
  ): void {
    const handle: HTMLElement = fixture.nativeElement.querySelector(
      'div.sky-test-tile-1 .sky-tile-grab-handle',
    );
    SkyAppTestUtility.fireDomEvent(handle, 'keydown', {
      keyboardEventInit: { key: keyName },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const columnEls = fixture.nativeElement.querySelectorAll(
      '.sky-tile-dashboard-column',
    );
    if (keyName === 'ArrowRight') {
      expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeFalsy();
      expect(columnEls[1].querySelector('div.sky-test-tile-1')).toBeTruthy();
      expect(
        columnEls[1].querySelectorAll('sky-tile')[1].parentElement,
      ).toHaveCssClass('sky-test-tile-1');
    } else {
      expect(columnEls[1].querySelector('div.sky-test-tile-1')).toBeFalsy();
      expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeTruthy();
      expect(
        columnEls[0].querySelectorAll('sky-tile')[2].parentElement,
      ).toHaveCssClass('sky-test-tile-1');
    }
  }

  it('should allow tiles to be moved between columns with the arrow keys', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Check navigating to the right column
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Boundary check navigating right, should not move
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Check navigating to the left column
    testIntercolumnNavigation(fixture, 'ArrowLeft');

    // Boundary check navigating left, should not move
    testIntercolumnNavigation(fixture, 'ArrowLeft');
  }));

  it('should allow tiles to be moved between columns with the arrow keys, with settings key', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.componentInstance.settingsKey = 'defaultSettings';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Check navigating to the right column
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Boundary check navigating right, should not move
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Check navigating to the left column
    testIntercolumnNavigation(fixture, 'ArrowLeft');

    // Boundary check navigating left, should not move
    testIntercolumnNavigation(fixture, 'ArrowLeft');
  }));

  it('should allow tiles to be moved between columns with the arrow keys, using tile.id as the fallback a11y label', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const tile1TestComponent = fixture.debugElement.query(
      By.directive(Tile1TestComponent),
    );
    expect(tile1TestComponent).toBeTruthy();
    // Set the title to an empty string to test fallback to tile.id
    tile1TestComponent.componentInstance.title = '';

    // Check navigating to the right column
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Boundary check navigating right, should not move
    testIntercolumnNavigation(fixture, 'ArrowRight');

    // Check navigating to the left column
    testIntercolumnNavigation(fixture, 'ArrowLeft');

    // Boundary check navigating left, should not move
    testIntercolumnNavigation(fixture, 'ArrowLeft');
  }));

  it('should do nothing if move tile is called with a tile that does not exist in a column', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const dashboardService = fixture.debugElement
      .query(By.directive(SkyTileDashboardComponent))
      .injector.get(SkyTileDashboardService);

    TestBed.runInInjectionContext(() => {
      dashboardService.moveTileOnKeyDown(
        new SkyTileComponent(
          fixture.elementRef,
          fixture.componentRef.changeDetectorRef,
          {
            configChange: new EventEmitter<SkyTileDashboardConfig>(),
          } as SkyTileDashboardService,
        ),
        'left',
        'Tile 1',
      );
    });

    // Make sure everything is still in the same spot
    const columnEls = fixture.nativeElement.querySelectorAll(
      '.sky-tile-dashboard-column',
    );
    expect(columnEls[1].querySelector('div.sky-test-tile-2')).toBeTruthy();
    expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeTruthy();
  }));

  function testColumnNavigation(
    fixture: ComponentFixture<TileDashboardTestComponent>,
    keyName: string,
    expectedPosition: number,
    isSingleColumn = false,
  ): void {
    const handle = fixture.nativeElement.querySelector(
      'div.sky-test-tile-1 .sky-tile-grab-handle',
    );
    SkyAppTestUtility.fireDomEvent(handle, 'keydown', {
      keyboardEventInit: { key: keyName },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const columnEls = fixture.nativeElement.querySelectorAll(
      '.sky-tile-dashboard-column',
    );
    if (isSingleColumn) {
      expect(
        columnEls[2].querySelectorAll('sky-tile')[expectedPosition]
          .parentElement,
      ).toHaveCssClass('sky-test-tile-1');
    } else {
      expect(
        columnEls[0].querySelectorAll('sky-tile')[expectedPosition]
          .parentElement,
      ).toHaveCssClass('sky-test-tile-1');
    }
  }

  it('should allow tiles to be moved within a column', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Standard check moving down
    testColumnNavigation(fixture, 'ArrowDown', 1);

    // Edge check moving down
    testColumnNavigation(fixture, 'ArrowDown', 2);

    // Boundary check moving down, should not move
    testColumnNavigation(fixture, 'ArrowDown', 2);

    // Standard check moving up
    testColumnNavigation(fixture, 'ArrowUp', 1);

    // Edge check moving up
    testColumnNavigation(fixture, 'ArrowUp', 0);

    // Boundary check moving up, should not move
    testColumnNavigation(fixture, 'ArrowUp', 0);
  }));

  it('should allow tiles to be moved within a column using arrowkey keys', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Standard check moving down
    testColumnNavigation(fixture, 'ArrowDown', 1);

    // Edge check moving down
    testColumnNavigation(fixture, 'ArrowDown', 2);

    // Boundary check moving down, should not move
    testColumnNavigation(fixture, 'ArrowDown', 2);

    // Standard check moving up
    testColumnNavigation(fixture, 'ArrowUp', 1);

    // Edge check moving up
    testColumnNavigation(fixture, 'ArrowUp', 0);

    // Boundary check moving up, should not move
    testColumnNavigation(fixture, 'ArrowUp', 0);
  }));

  it('should allow tiles to be moved within a column in single column mode', fakeAsync(() => {
    const fixture = createDashboardTestComponent();
    mediaQueryController.setBreakpoint('sm');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    testColumnNavigation(fixture, 'ArrowDown', 2, true);

    testColumnNavigation(fixture, 'ArrowUp', 1, true);

    testColumnNavigation(fixture, 'ArrowDown', 2, true);

    testColumnNavigation(fixture, 'ArrowUp', 1, true);
  }));

  it('should raise a config change event when a tile is collapsed', () => {
    let configChanged = false;

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        configChanged = true;

        expect(config.layout.multiColumn[0].tiles[0].isCollapsed).toBe(true);
      },
    );

    dashboardService.init(
      dashboardConfig,
      undefined,
      undefined,
      'mySettingsKey',
    );

    const fixture = TestBed.createComponent(Tile1TestComponent);

    const cmp: Tile1TestComponent = fixture.componentInstance;

    fixture.detectChanges();

    dashboardService.addTileComponent(
      {
        id: 'tile-1',
        isCollapsed: false,
      },
      fixture.componentRef,
    );

    dashboardService.setTileCollapsed(cmp.tile, true);

    expect(configChanged).toBe(true);
  });

  it('should provide a way for a tile to know whether it is collapsed', () => {
    dashboardService.init(dashboardConfig);

    const fixture = TestBed.createComponent(Tile1TestComponent);

    const cmp: Tile1TestComponent = fixture.componentInstance;

    fixture.detectChanges();

    dashboardService.addTileComponent(
      {
        id: 'tile-1',
        isCollapsed: false,
      },
      fixture.componentRef,
    );

    expect(dashboardService.tileIsCollapsed(cmp.tile)).toBe(false);

    dashboardService.setTileCollapsed(cmp.tile, true);

    expect(dashboardService.tileIsCollapsed(cmp.tile)).toBe(true);
  });

  it('should provide a way to retrieve the component for the associated layout tile', () => {
    dashboardService.init(dashboardConfig);

    const multiColumn = dashboardConfig.layout.multiColumn;
    const column1 = multiColumn[0];
    const column2 = multiColumn[1];

    expect(dashboardService.getTileComponentType(column1.tiles[0])).toBe(
      Tile1TestComponent,
    );
    expect(dashboardService.getTileComponentType(column2.tiles[0])).toBe(
      Tile2TestComponent,
    );

    expect(dashboardService.getTileComponentType(undefined)).toBe(undefined);
  });

  it('should initialize tiles in the appropriate columns for the current screen size', fakeAsync(() => {
    function getTileCount(columnEl: Element): number {
      return columnEl.querySelectorAll('sky-tile').length;
    }

    const fixture = createDashboardTestComponent();
    const el = fixture.nativeElement;

    mediaQueryController.setBreakpoint('sm');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const multiColumnEls = el.querySelectorAll(
      '.sky-tile-dashboard-layout-multi',
    );
    const singleColumnEl = el.querySelector(
      '.sky-tile-dashboard-layout-single',
    );

    expect(getTileCount(multiColumnEls[0])).toBe(0);
    expect(getTileCount(multiColumnEls[1])).toBe(0);
    expect(getTileCount(singleColumnEl)).toBe(4);
  }));

  it('should move tiles to the appropriate columns when the screen size changes', fakeAsync(() => {
    function getTileCount(columnEl: Element): number {
      return columnEl.querySelectorAll('sky-tile').length;
    }

    const fixture = createDashboardTestComponent();

    const el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    const multiColumnEls = el.querySelectorAll(
      '.sky-tile-dashboard-layout-multi',
    );
    const singleColumnEl = el.querySelector(
      '.sky-tile-dashboard-layout-single',
    );

    expect(getTileCount(multiColumnEls[0])).toBe(3);
    expect(getTileCount(multiColumnEls[1])).toBe(1);
    expect(getTileCount(singleColumnEl)).toBe(0);

    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();

    expect(getTileCount(multiColumnEls[0])).toBe(0);
    expect(getTileCount(multiColumnEls[1])).toBe(0);
    expect(getTileCount(singleColumnEl)).toBe(4);

    mediaQueryController.setBreakpoint('md');

    fixture.detectChanges();

    expect(getTileCount(multiColumnEls[0])).toBe(3);
    expect(getTileCount(multiColumnEls[1])).toBe(1);
    expect(getTileCount(singleColumnEl)).toBe(0);
  }));

  it('should return the expected config regardless of which column mode is active', fakeAsync(() => {
    const fixture = createDashboardTestComponent();

    const cmp = fixture.componentInstance;

    const expectedDashboardConfig = cmp.dashboardConfig;

    fixture.detectChanges();
    tick();

    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();

    mockDragulaService.drop().next({});

    fixture.detectChanges();
    tick();

    expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);

    mediaQueryController.setBreakpoint('lg');

    fixture.detectChanges();

    mockDragulaService.drop().next({});

    fixture.detectChanges();
    tick();

    expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);
  }));

  it('should sanity check for invalid tile when setting a tile to be collapsed', () => {
    dashboardService.setTileCollapsed(undefined, true);
  });

  it('should return default config when settingsKey exists', () => {
    dashboardService.init(
      dashboardConfig,
      undefined,
      undefined,
      'defaultSettings',
    );

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      },
    );
  });

  it('should return default config when data is not valid', () => {
    dashboardService.init(dashboardConfig, undefined, undefined, 'badData');

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      },
    );
  });

  it('should return default config when an error occurs from the config service', () => {
    dashboardService.init(dashboardConfig, undefined, undefined, 'error');

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      },
    );
  });

  it('should get and apply user config when it exists', () => {
    dashboardService.init(
      dashboardConfig,
      undefined,
      undefined,
      'mySettingsKey',
    );

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        const expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: true,
              },
              {
                id: 'tile-2',
                isCollapsed: true,
              },
            ],
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true,
                },
              ],
            },
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true,
                },
              ],
            },
          ],
        };
        expect(config.layout).toEqual(expectedLayout);
      },
    );
  });

  it('should handle add a new tile in the appropriate column', () => {
    const newTileConfig = {
      tiles: [
        {
          id: 'tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'tile-2',
          componentType: Tile2TestComponent,
        },
        {
          id: 'tile-3',
          componentType: Tile2TestComponent,
        },
        {
          id: 'tile-4',
          componentType: Tile1TestComponent,
        },
      ],
      layout: {
        multiColumn: [
          {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: false,
              },
            ],
          },
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false,
              },
              {
                id: 'tile-3',
                isCollapsed: true,
              },
              {
                id: 'tile-4',
                isCollapsed: true,
              },
            ],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: true,
            },
            {
              id: 'tile-1',
              isCollapsed: true,
            },
            {
              id: 'tile-3',
              isCollapsed: true,
            },
            {
              id: 'tile-4',
              isCollapsed: true,
            },
          ],
        },
      },
    };

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        const expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: true,
              },
              {
                id: 'tile-2',
                isCollapsed: true,
              },
              {
                id: 'tile-3',
                isCollapsed: false,
              },
              {
                id: 'tile-4',
                isCollapsed: false,
              },
            ],
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true,
                },
                {
                  id: 'tile-3',
                  isCollapsed: false,
                },
              ],
            },
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true,
                },
                {
                  id: 'tile-4',
                  isCollapsed: false,
                },
              ],
            },
          ],
        };
        expect(config.layout).toEqual(expectedLayout);
      },
    );
    dashboardService.init(newTileConfig, undefined, undefined, 'mySettingsKey');
  });

  it('should handle add a new tile missing from layout', waitForAsync(async () => {
    let done: () => void;
    const configChange = new Promise<void>((resolve) => {
      done = (): void => resolve();
    });
    const newTileConfig = {
      tiles: [
        {
          id: 'tile-1',
          componentType: Tile1TestComponent,
        },
        {
          id: 'tile-2',
          componentType: Tile2TestComponent,
        },
        {
          id: 'tile-3',
          componentType: Tile2TestComponent,
        },
        {
          id: 'tile-4',
          componentType: Tile1TestComponent,
        },
      ],
      layout: {
        multiColumn: [
          {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: false,
              },
            ],
          },
          {
            tiles: [],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-1',
              isCollapsed: true,
            },
            {
              id: 'tile-2',
              isCollapsed: true,
            },
          ],
        },
      },
    };

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        const expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: true,
              },
              {
                id: 'tile-2',
                isCollapsed: true,
              },
              {
                id: 'tile-3',
                isCollapsed: false,
              },
              {
                id: 'tile-4',
                isCollapsed: false,
              },
            ],
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: false,
                },
                {
                  id: 'tile-3',
                  isCollapsed: false,
                },
              ],
            },
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: false,
                },
                {
                  id: 'tile-4',
                  isCollapsed: false,
                },
              ],
            },
          ],
        };
        expect(config.layout).toEqual(expectedLayout);
        done();
      },
    );
    dashboardService.init(newTileConfig);
    await configChange;
  }));

  it('should handle add a new tile missing from layout but included in `oldTileIds`', waitForAsync(async () => {
    let done: () => void;
    const configChange = new Promise<void>((resolve) => {
      done = (): void => resolve();
    });
    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual({
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: false,
                },
              ],
            },
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: false,
                },
              ],
            },
          ],
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: false,
              },
              {
                id: 'tile-2',
                isCollapsed: false,
              },
            ],
          },
        });
        done();
      },
    );
    dashboardService.init(
      dashboardConfig,
      undefined,
      undefined,
      'missingLayout',
    );
    await configChange;
  }));

  it('should handle removed tile in default', () => {
    const newTileConfig = {
      tiles: [
        {
          id: 'tile-2',
          componentType: Tile2TestComponent,
        },
      ],
      layout: {
        multiColumn: [
          {
            tiles: [],
          },
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false,
              },
            ],
          },
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: true,
            },
          ],
        },
      },
    };

    dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        const expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: true,
              },
            ],
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true,
                },
              ],
            },
            {
              tiles: [],
            },
          ],
        };
        expect(config.layout).toEqual(expectedLayout);
      },
    );
    dashboardService.init(newTileConfig, undefined, undefined, 'mySettingsKey');
  });

  it('should handle errors when setting config', () => {
    const warnSpy = spyOn(console, 'warn');

    dashboardService.init(dashboardConfig, undefined, undefined, 'badData');

    const fixture = TestBed.createComponent(Tile1TestComponent);

    const cmp: Tile1TestComponent = fixture.componentInstance;

    fixture.detectChanges();

    dashboardService.addTileComponent(
      {
        id: 'tile-1',
        isCollapsed: false,
      },
      fixture.componentRef,
    );

    dashboardService.setTileCollapsed(cmp.tile, true);

    expect(warnSpy).toHaveBeenCalledWith(
      'Could not save tile dashboard settings.',
    );
    expect(warnSpy).toHaveBeenCalledWith({
      message: 'Test error',
    });
  });
});
