
import {
  EventEmitter
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints,
  SkyUIConfigService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  DragulaService
} from 'ng2-dragula';

import {
  MockDragulaService
} from './fixtures/mock-dragula.service';

import {
  MockSkyUIConfigService
} from './fixtures/mock-ui-config.service';

import {
  Tile1TestComponent
} from './fixtures/tile1.component.fixture';

import {
  Tile2TestComponent
} from './fixtures/tile2.component.fixture';

import {
  TileTestContext
} from './fixtures/tile-context.fixture';

import {
  TileDashboardTestComponent
} from './fixtures/tile-dashboard.component.fixture';

import {
  SkyTileDashboardFixturesModule
} from './fixtures/tile-dashboard-fixtures.module';

import {
  SkyTileComponent
} from '../tile/tile.component';

import {
  SkyTilesModule
} from '../tiles.module';

import {
  SkyTileDashboardComponent
} from '../tile-dashboard/tile-dashboard.component';

import {
  SkyTileDashboardService
} from '../tile-dashboard/tile-dashboard.service';

import {
  SkyTileDashboardConfig
} from '../tile-dashboard-config/tile-dashboard-config';

describe('Tile dashboard service', () => {
  let dashboardConfig: SkyTileDashboardConfig;
  let mockDragulaService: DragulaService;
  let mockMediaQueryService: MockSkyMediaQueryService;
  let mockUIConfigService: MockSkyUIConfigService;

  function createDashboardTestComponent() {
    return TestBed
      .overrideComponent(SkyTileDashboardComponent, {
        add: {
          providers: [
            { provide: SkyMediaQueryService, useValue: mockMediaQueryService }
          ]
        }
      })
      .createComponent(TileDashboardTestComponent);
  }

  beforeEach(() => {
    mockDragulaService = new MockDragulaService();
    mockMediaQueryService = new MockSkyMediaQueryService();
    mockUIConfigService = new MockSkyUIConfigService();

    TestBed.configureTestingModule({
      imports: [
        SkyTileDashboardFixturesModule,
        SkyTilesModule
      ],
      providers: [
        { provide: DragulaService, useValue: mockDragulaService },
        { provide: SkyMediaQueryService, useValue: mockMediaQueryService },
        { provide: SkyUIConfigService, useValue: mockUIConfigService },
        SkyTileDashboardService
      ]
    });

    dashboardConfig = {
      tiles: [
        {
          id: 'tile-1',
          componentType: Tile1TestComponent
        },
        {
          id: 'tile-2',
          componentType: Tile2TestComponent
        }
      ],
      layout: {
        multiColumn: [
          {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: false
              }
            ]
          },
          {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: false
              }
            ]
          }
        ],
        singleColumn: {
          tiles: [
            {
              id: 'tile-2',
              isCollapsed: true
            },
            {
              id: 'tile-1',
              isCollapsed: true
            }
          ]
        }
      }
    };
  });

  it('should emit the config change event when a tile is moved',
    fakeAsync(
      () => {
        let fixture = createDashboardTestComponent();
        fixture.detectChanges();
        let dashboardService = fixture.componentInstance.dashboardComponent['dashboardService'];
        let configChanged = false;

        fixture.componentInstance.settingsKey = 'defaultSettings';

        dashboardService.configChange.subscribe(
          (config: SkyTileDashboardConfig) => {
            configChanged = true;

            let expectedConfig: SkyTileDashboardConfig = {
              tiles: [
                {
                  id: 'sky-test-tile-1',
                  componentType: Tile1TestComponent
                },
                {
                  id: 'sky-test-tile-2',
                  componentType: Tile2TestComponent,
                  providers: [
                    {
                      provide: TileTestContext,
                      useValue: {
                        id: 3
                      }
                    }
                  ]
                },
                {
                  id: 'sky-test-tile-3',
                  componentType: Tile2TestComponent,
                  providers: [
                    {
                      provide: TileTestContext,
                      useValue: {
                        id: 3
                      }
                    }
                  ]
                },
                {
                  id: 'sky-test-tile-4',
                  componentType: Tile2TestComponent,
                  providers: [
                    {
                      provide: TileTestContext,
                      useValue: {
                        id: 3
                      }
                    }
                  ]
                }
              ],
              layout: {
                singleColumn: {
                  tiles: [
                    {
                      id: 'sky-test-tile-2',
                      isCollapsed: false
                    },
                    {
                      id: 'sky-test-tile-1',
                      isCollapsed: true
                    },
                    {
                      id: 'sky-test-tile-3',
                      isCollapsed: false
                    },
                    {
                      id: 'sky-test-tile-4',
                      isCollapsed: false
                    }
                  ]
                },
                multiColumn: [
                  {
                    tiles: [
                      {
                        id: 'sky-test-tile-3',
                        isCollapsed: false
                      },
                      {
                        id: 'sky-test-tile-4',
                        isCollapsed: false
                      }
                    ]
                  },
                  {
                    tiles: [
                      {
                        id: 'sky-test-tile-2',
                        isCollapsed: false
                      },
                      {
                        id: 'sky-test-tile-1',
                        isCollapsed: true
                      }
                    ]
                  }
                ]
              }
            };

            expect(config).toEqual(expectedConfig);
          }
        );

        fixture.detectChanges();
        tick();

        let el = fixture.nativeElement;

        let columnEls = el.querySelectorAll('.sky-tile-dashboard-column');

        columnEls[1].appendChild(columnEls[0].querySelector('div.sky-test-tile-1'));

        mockDragulaService.drop.emit({});
        tick();

        expect(configChanged).toBe(true);
      })
  );

  it('should set the tile\'s grab handle as the drag handle', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let tile: Element = fixture.nativeElement.querySelector('div.sky-test-tile-1');
    let handle: Element = tile.querySelector('.sky-tile-grab-handle i');
    let setOptionsSpy = spyOn(mockDragulaService, 'setOptions').and.callFake(
      (bagId: any, options: any) => {
        let result = options.moves(
          tile,
          undefined,
          handle
        );

        expect(result).toBe(true);
      }
    );

    (function () {
      return new SkyTileDashboardService(
        mockDragulaService,
        mockMediaQueryService as any,
        mockUIConfigService
      );
    }());

    expect(setOptionsSpy).toHaveBeenCalled();
  }));

  function testIntercolumnNavigation(fixture: ComponentFixture<TileDashboardTestComponent>, keyName: string) {
    let handle: HTMLElement = fixture.nativeElement.querySelector('div.sky-test-tile-1 .sky-tile-grab-handle');
    SkyAppTestUtility.fireDomEvent(handle, 'keydown', {
      keyboardEventInit: { key: keyName }
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let columnEls = fixture.nativeElement.querySelectorAll('.sky-tile-dashboard-column');
    if (keyName === 'Right' || keyName === 'ArrowRight') {
      expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeFalsy();
      expect(columnEls[1].querySelector('div.sky-test-tile-1')).toBeTruthy();
      expect(columnEls[1].querySelectorAll('sky-tile')[1].parentElement).toHaveCssClass('sky-test-tile-1');
    } else {
      expect(columnEls[1].querySelector('div.sky-test-tile-1')).toBeFalsy();
      expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeTruthy();
      expect(columnEls[0].querySelectorAll('sky-tile')[2].parentElement).toHaveCssClass('sky-test-tile-1');
    }
  }

  it('should allow tiles to be moved between columns with the keyboard', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Check navigating to the right column
    testIntercolumnNavigation(fixture, 'Right');

    // Boundary check navigating right, should not move
    testIntercolumnNavigation(fixture, 'Right');

    // Check navigating to the left column
    testIntercolumnNavigation(fixture, 'Left');

    // Boundary check navigating left, should not move
    testIntercolumnNavigation(fixture, 'Left');
  }));

  it('should allow tiles to be moved between columns with the arrowkey keys', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
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

  it('should do nothing if move tile is called with a tile that does not exist in a column', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let dashboardService: SkyTileDashboardService = fixture.componentInstance.dashboardComponent['dashboardService'];
    dashboardService.moveTileOnKeyDown(
      new SkyTileComponent(
        fixture.elementRef,
        fixture.componentRef.changeDetectorRef,
        {
          configChange: new EventEmitter<SkyTileDashboardConfig>()
        } as SkyTileDashboardService
      ), 'left', 'Tile 1');

    // Make sure eveything is still in the same spot
    let columnEls = fixture.nativeElement.querySelectorAll('.sky-tile-dashboard-column');
    expect(columnEls[1].querySelector('div.sky-test-tile-2')).toBeTruthy();
    expect(columnEls[0].querySelector('div.sky-test-tile-1')).toBeTruthy();
  }));

  function testColumnNavigation(
    fixture: ComponentFixture<TileDashboardTestComponent>,
    keyName: string,
    expectedPosition: number,
    isSingleColumn = false
  ) {
    let handle = fixture.nativeElement.querySelector('div.sky-test-tile-1 .sky-tile-grab-handle');
    SkyAppTestUtility.fireDomEvent(handle, 'keydown', {
      keyboardEventInit: { key: keyName }
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let columnEls = fixture.nativeElement.querySelectorAll('.sky-tile-dashboard-column');
    if (isSingleColumn) {
      expect(columnEls[2].querySelectorAll('sky-tile')[expectedPosition].parentElement).toHaveCssClass('sky-test-tile-1');
    } else {
      expect(columnEls[0].querySelectorAll('sky-tile')[expectedPosition].parentElement).toHaveCssClass('sky-test-tile-1');
    }
  }

  it('should allow tiles to be moved within a column', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Standard check moving down
    testColumnNavigation(fixture, 'Down', 1);

    // Edge check moving down
    testColumnNavigation(fixture, 'Down', 2);

    // Boundary check moving down, should not move
    testColumnNavigation(fixture, 'Down', 2);

    // Standard check moving up
    testColumnNavigation(fixture, 'Up', 1);

    // Edge check moving up
    testColumnNavigation(fixture, 'Up', 0);

    // Boundary check moving up, should not move
    testColumnNavigation(fixture, 'Up', 0);
  }));

  it('should allow tiles to be moved within a column using arrowkey keys', fakeAsync(() => {
    let fixture = createDashboardTestComponent();
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
    let fixture = createDashboardTestComponent();
    mockMediaQueryService.fire(SkyMediaBreakpoints.sm);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    testColumnNavigation(fixture, 'Down', 2, true);

    testColumnNavigation(fixture, 'Up', 1, true);

    testColumnNavigation(fixture, 'ArrowDown', 2, true);

    testColumnNavigation(fixture, 'ArrowUp', 1, true);
  }));

  it(
    'should raise a config change event when a tile is collapsed',
    inject(
      [SkyTileDashboardService],
      (dashboardService: SkyTileDashboardService) => {
        let configChanged = false;

        dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
          configChanged = true;

          expect(config.layout.multiColumn[0].tiles[0].isCollapsed).toBe(true);
        });

        dashboardService.init(dashboardConfig, undefined, undefined, 'mySettingsKey');

        let fixture = TestBed.createComponent(Tile1TestComponent);

        let cmp: Tile1TestComponent = fixture.componentInstance;

        fixture.detectChanges();

        dashboardService.addTileComponent(
          {
            id: 'tile-1',
            isCollapsed: false
          },
          fixture.componentRef
        );

        dashboardService.setTileCollapsed(
          cmp.tile,
          true
        );

        expect(configChanged).toBe(true);
      }
    )
  );

  it(
    'should provide a way for a tile to know whether it is collapsed',
    inject(
      [SkyTileDashboardService],
      (dashboardService: SkyTileDashboardService) => {
        dashboardService.init(dashboardConfig);

        let fixture = TestBed.createComponent(Tile1TestComponent);

        let cmp: Tile1TestComponent = fixture.componentInstance;

        fixture.detectChanges();

        dashboardService.addTileComponent(
          {
            id: 'tile-1',
            isCollapsed: false
          },
          fixture.componentRef
        );

        expect(dashboardService.tileIsCollapsed(cmp.tile)).toBe(false);

        dashboardService.setTileCollapsed(
          cmp.tile,
          true
        );

        expect(dashboardService.tileIsCollapsed(cmp.tile)).toBe(true);
      }
    )
  );

  it(
    'should provide a way to retrieve the component for the associated layout tile',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig);

      let multiColumn = dashboardConfig.layout.multiColumn;
      let column1 = multiColumn[0];
      let column2 = multiColumn[1];

      expect(dashboardService.getTileComponentType(column1.tiles[0])).toBe(Tile1TestComponent);
      expect(dashboardService.getTileComponentType(column2.tiles[0])).toBe(Tile2TestComponent);

      expect(dashboardService.getTileComponentType(undefined)).toBe(undefined);
    })
  );

  it(
    'should initialize tiles in the appropriate columns for the current screen size',
    fakeAsync(() => {
      function getTileCount(columnEl: Element): number {
        return columnEl.querySelectorAll('sky-tile').length;
      }

      let fixture = createDashboardTestComponent();
      let el = fixture.nativeElement;

      mockMediaQueryService.fire(SkyMediaBreakpoints.sm);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let multiColumnEls = el.querySelectorAll('.sky-tile-dashboard-layout-multi');
      let singleColumnEl = el.querySelector('.sky-tile-dashboard-layout-single');

      expect(getTileCount(multiColumnEls[0])).toBe(0);
      expect(getTileCount(multiColumnEls[1])).toBe(0);
      expect(getTileCount(singleColumnEl)).toBe(4);
    })
  );

  it(
    'should move tiles to the appropriate columns when the screen size changes',
    fakeAsync(() => {
      function getTileCount(columnEl: Element): number {
        return columnEl.querySelectorAll('sky-tile').length;
      }

      let fixture = createDashboardTestComponent();

      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      let multiColumnEls = el.querySelectorAll('.sky-tile-dashboard-layout-multi');
      let singleColumnEl = el.querySelector('.sky-tile-dashboard-layout-single');

      expect(getTileCount(multiColumnEls[0])).toBe(3);
      expect(getTileCount(multiColumnEls[1])).toBe(1);
      expect(getTileCount(singleColumnEl)).toBe(0);

      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);

      fixture.detectChanges();

      expect(getTileCount(multiColumnEls[0])).toBe(0);
      expect(getTileCount(multiColumnEls[1])).toBe(0);
      expect(getTileCount(singleColumnEl)).toBe(4);

      mockMediaQueryService.fire(SkyMediaBreakpoints.md);

      fixture.detectChanges();

      expect(getTileCount(multiColumnEls[0])).toBe(3);
      expect(getTileCount(multiColumnEls[1])).toBe(1);
      expect(getTileCount(singleColumnEl)).toBe(0);
    })
  );

  it(
    'should return the expected config regardless of which column mode is active',
    fakeAsync(() => {
      let fixture = createDashboardTestComponent();

      let cmp = fixture.componentInstance;

      let expectedDashboardConfig = cmp.dashboardConfig;

      fixture.detectChanges();
      tick();

      mockMediaQueryService.fire(SkyMediaBreakpoints.xs);

      mockDragulaService.drop.emit({});

      fixture.detectChanges();
      tick();

      expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);

      mockMediaQueryService.fire(SkyMediaBreakpoints.lg);

      mockDragulaService.drop.emit({});

      fixture.detectChanges();
      tick();

      expect(cmp.dashboardConfig).toEqual(expectedDashboardConfig);
    })
  );

  it(
    'should sanity check for invalid tile when setting a tile to be collapsed',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.setTileCollapsed(undefined, true);
    })
  );

  it(
    'should release resources when destroyed',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig, undefined, undefined, 'mySettingsKey');

      dashboardService.destroy();

      expect(mockMediaQueryService.currentMockSubject.observers.length).toBe(0);
    })
  );

  it(
    'should return default config when settingsKey exists',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig, undefined, undefined, 'defaultSettings');

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      });
    })
  );

  it(
    'should return default config when data is not valid',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig, undefined, undefined, 'badData');

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      });
    })
  );

  it(
    'should return default config when an error occurs from the config service',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig, undefined, undefined, 'error');

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        expect(config.layout).toEqual(dashboardConfig.layout);
      });
    })
  );

  it(
    'should get and apply user config when it exists',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      dashboardService.init(dashboardConfig, undefined, undefined, 'mySettingsKey');

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        let expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: true
              },
              {
                id: 'tile-2',
                isCollapsed: true
              }
            ]
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true
                }
              ]
            },
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true
                }
              ]
            }
          ]
        };
        expect(config.layout).toEqual(expectedLayout);
      });
    })
  );

  it(
    'should handle add a new tile in the appropriate column',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      let newTileConfig = {
        tiles: [
          {
            id: 'tile-1',
            componentType: Tile1TestComponent
          },
          {
            id: 'tile-2',
            componentType: Tile2TestComponent
          },
          {
            id: 'tile-3',
            componentType: Tile2TestComponent
          },
          {
            id: 'tile-4',
            componentType: Tile1TestComponent
          }
        ],
        layout: {
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: false
                }
              ]
            },
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: false
                },
                {
                  id: 'tile-3',
                  isCollapsed: true
                },
                {
                  id: 'tile-4',
                  isCollapsed: true
                }
              ]
            }
          ],
          singleColumn: {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: true
              },
              {
                id: 'tile-1',
                isCollapsed: true
              },
              {
                id: 'tile-3',
                isCollapsed: true
              },
              {
                id: 'tile-4',
                isCollapsed: true
              }
            ]
          }
        }
      };

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        let expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-1',
                isCollapsed: true
              },
              {
                id: 'tile-2',
                isCollapsed: true
              },
              {
                id: 'tile-3',
                isCollapsed: false
              },
              {
                id: 'tile-4',
                isCollapsed: false
              }
            ]
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true
                },
                {
                  id: 'tile-3',
                  isCollapsed: false
                }
              ]
            },
            {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true
                },
                {
                  id: 'tile-4',
                  isCollapsed: false
                }
              ]
            }
          ]
        };
        expect(config.layout).toEqual(expectedLayout);
      });
      dashboardService.init(newTileConfig, undefined, undefined, 'mySettingsKey');
    })
  );

  it(
    'should handle removed tile in default',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      let newTileConfig = {
        tiles: [
          {
            id: 'tile-2',
            componentType: Tile2TestComponent
          }
        ],
        layout: {
          multiColumn: [
            {
              tiles: [
              ]
            },
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: false
                }
              ]
            }
          ],
          singleColumn: {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: true
              }
            ]
          }
        }
      };

      dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
        let expectedLayout = {
          singleColumn: {
            tiles: [
              {
                id: 'tile-2',
                isCollapsed: true
              }
            ]
          },
          multiColumn: [
            {
              tiles: [
                {
                  id: 'tile-2',
                  isCollapsed: true
                }
              ]
            },
            {
              tiles: [
              ]
            }
          ]
        };
        expect(config.layout).toEqual(expectedLayout);
      });
      dashboardService.init(newTileConfig, undefined, undefined, 'mySettingsKey');
    })
  );

  it(
    'should handle errors when setting config',
    inject([SkyTileDashboardService], (dashboardService: SkyTileDashboardService) => {
      const warnSpy = spyOn(console, 'warn');

      dashboardService.init(dashboardConfig, undefined, undefined, 'badData');

      let fixture = TestBed.createComponent(Tile1TestComponent);

      let cmp: Tile1TestComponent = fixture.componentInstance;

      fixture.detectChanges();

      dashboardService.addTileComponent(
        {
          id: 'tile-1',
          isCollapsed: false
        },
        fixture.componentRef
      );

      dashboardService.setTileCollapsed(
        cmp.tile,
        true
      );

      expect(warnSpy).toHaveBeenCalledWith('Could not save tile dashboard settings.');
      expect(warnSpy).toHaveBeenCalledWith({
        message: 'Test error'
      });
    })
  );

});
