import {
  ComponentRef,
  EventEmitter,
  Injectable,
  Output,
  QueryList,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
  SkyMediaQueryService,
  SkyUIConfigService,
} from '@skyux/core';

import { DragulaService } from 'ng2-dragula';
import { take } from 'rxjs/operators';

import { SkyTileDashboardColumnComponent } from '../tile-dashboard-column/tile-dashboard-column.component';
import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';
import { SkyTileDashboardConfigLayoutColumn } from '../tile-dashboard-config/tile-dashboard-config-layout-column';
import { SkyTileDashboardConfigLayoutTile } from '../tile-dashboard-config/tile-dashboard-config-layout-tile';
import { SkyTileDashboardConfigTile } from '../tile-dashboard-config/tile-dashboard-config-tile';
import { SkyTileComponent } from '../tile/tile.component';

import { SkyTileDashboardColumnMode } from './tile-dashboard-column-mode';

const ATTR_TILE_ID = '_sky-tile-dashboard-tile-id';

let bagIdIndex = 0;

@Injectable()
export class SkyTileDashboardService {
  /**
   * @internal
   */
  public bagId: string;

  /**
   * @internal
   */
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  /**
   * Fires when the tile dashboard's initialization is complete.
   */
  @Output()
  public dashboardInitialized = new EventEmitter<void>();

  #columns: QueryList<SkyTileDashboardColumnComponent> | undefined;
  #config: SkyTileDashboardConfig | undefined;
  #singleColumn: SkyTileDashboardColumnComponent | undefined;
  #settingsKey: string | undefined;
  #tileComponents: ComponentRef<any>[] | undefined;

  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  readonly #dragulaService = inject(DragulaService);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #uiConfigService = inject(SkyUIConfigService);

  #mode: SkyTileDashboardColumnMode | undefined;

  constructor() {
    effect(() => {
      const breakpoint = this.#breakpoint();
      const mode =
        breakpoint === 'xs' || breakpoint === 'sm' ? 'single' : 'multi';

      if (mode !== this.#mode) {
        this.#mode = mode;
        this.changeColumnMode(mode);
      }
    });

    this.bagId = `sky-tile-dashboard-bag-${++bagIdIndex}`;

    this.#initDragula();
  }

  /**
   * @internal
   */
  public init(
    config: SkyTileDashboardConfig,
    columns?: QueryList<SkyTileDashboardColumnComponent>,
    singleColumn?: SkyTileDashboardColumnComponent,
    settingsKey?: string,
  ): void {
    if (settingsKey) {
      // Clone this so changes to the config object outside of this class don't modify
      // the config used inside and vice versa.
      this.#config = Object.assign({}, config) as SkyTileDashboardConfig;

      this.#settingsKey = settingsKey;

      this.#uiConfigService
        .getConfig(settingsKey, config)
        .pipe(take(1))
        .subscribe(
          (value: any) => {
            if (this.#config && value.persisted) {
              this.#config.layout = value.layout;
              this.#checkForNewTiles(value.tileIds);
              this.configChange.emit(this.#config);

              this.#columns = columns;
              this.#singleColumn = singleColumn;
              this.#checkReadyAndLoadTiles();
            } else {
              // Bad data, or config is the default config.
              this.#initToDefaults(config, columns, singleColumn);
            }
          },
          () => {
            // Config setting key doesn't exist or other config service error
            this.#initToDefaults(config, columns, singleColumn);
          },
        );
    } else {
      this.#initToDefaults(config, columns, singleColumn);
    }
  }

  /**
   * Adds a new tile to the tile dashboard.
   * @param tile Specifies the tile configuration.
   * @param component Specifies the tile component to add.
   */
  public addTileComponent(
    tile: SkyTileDashboardConfigLayoutTile,
    component: ComponentRef<any>,
  ): void {
    this.#tileComponents = this.#tileComponents || [];

    this.#tileComponents.push(component);

    component.location.nativeElement.setAttribute(ATTR_TILE_ID, tile.id);
  }

  /**
   * Checks whether a specified tile is collapsed.
   * @param tile Specifies the tile component to check.
   */
  public tileIsCollapsed(tile: SkyTileComponent): boolean {
    const tileConfig = this.#findTile(this.#getTileId(tile));

    if (tileConfig) {
      return tileConfig.isCollapsed;
    }

    return false;
  }

  /**
   * Sets the collapsed state of all tiles.
   * @param isCollapsed Indicates whether tiles are collapsed.
   */
  public setAllTilesCollapsed(isCollapsed: boolean): void {
    /*istanbul ignore else */
    if (this.#config && this.#config.layout.multiColumn) {
      for (const column of this.#config.layout.multiColumn) {
        for (const tile of column.tiles) {
          tile.isCollapsed = isCollapsed;
        }
      }
      for (const tile of this.#config.layout.singleColumn.tiles) {
        tile.isCollapsed = isCollapsed;
      }
    }

    if (this.#settingsKey) {
      this.#setUserConfig(this.#config);
    }

    this.configChange.emit(this.#config);
  }

  /**
   * Sets the collapsed state of a specified tile.
   * @param tile Specifies the tile component.
   * @param isCollapsed Indicates whether the tile is collapsed.
   */
  public setTileCollapsed(
    tile: SkyTileComponent | undefined,
    isCollapsed: boolean,
  ): void {
    const tileConfig = this.#findTile(this.#getTileId(tile));

    if (tileConfig) {
      tileConfig.isCollapsed = isCollapsed;

      if (this.#settingsKey) {
        this.#setUserConfig(this.#config);
      }

      this.configChange.emit(this.#config);
    }
  }

  /**
   * @internal
   */
  public getTileComponentType(
    layoutTile: SkyTileDashboardConfigLayoutTile | undefined,
  ): any {
    if (layoutTile && this.#config) {
      for (const tile of this.#config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile.componentType;
        }
      }
    }

    return undefined;
  }

  /**
   * @internal
   */
  public changeColumnMode(mode: SkyTileDashboardColumnMode): void {
    /*istanbul ignore else */
    if (this.#config) {
      if (mode === 'single') {
        this.#moveTilesToSingleColumn();
      } else {
        this.#moveTilesToMultiColumn();
      }
    }
  }

  /**
   * @internal
   */
  public getTileComponent(tileId: string): ComponentRef<any> | undefined {
    if (this.#tileComponents) {
      for (const tileComponent of this.#tileComponents) {
        if (
          tileComponent.location.nativeElement.getAttribute(ATTR_TILE_ID) ===
          tileId
        ) {
          return tileComponent;
        }
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  /**
   * @internal
   */
  public moveTileOnKeyDown(
    tileCmp: SkyTileComponent,
    direction: string,
    tileDescription: string,
  ): void {
    if (this.#config) {
      const mode = this.#mode;
      const tileId = this.#getTileId(tileCmp);
      const tile = this.#findTile(tileId);

      let column: SkyTileDashboardConfigLayoutColumn | undefined;
      let colIndex = 0;

      if (mode === 'single') {
        column = this.#config.layout.singleColumn;
      } else {
        column = this.#findTileColumn(tileId);
        colIndex = this.#config.layout.multiColumn.findIndex(
          (value) => value === column,
        );
      }

      if (column && tile && tileId) {
        if (
          (direction === 'left' || direction === 'right') &&
          mode === 'multi'
        ) {
          const operator = direction === 'left' ? -1 : 1;
          const newColumn =
            this.#config.layout.multiColumn[colIndex + operator];

          if (newColumn) {
            // Move the tile to the end of the new column
            newColumn.tiles.push(tile);
            column.tiles = column.tiles.filter((item) => item !== tile);
            this.#moveTilesToColumn(
              this.#columns?.toArray()[colIndex + operator],
              [tile],
            );

            // Report the change in configuration
            const reportConfig = this.#config;
            reportConfig.movedTile = {
              tileDescription:
                tileDescription || /* istanbul ignore next */ tile.id,
              column: colIndex + operator + 1,
              position: newColumn.tiles.length,
            };
            this.configChange.emit(reportConfig);
          }
        } else {
          const operator = direction === 'up' ? -1 : 1;
          const curIndex = column.tiles.findIndex(
            (value) => value.id === tile.id,
          );
          const tileComponentInstance = this.getTileComponent(tileId);

          if (tileComponentInstance && column.tiles[curIndex + operator]) {
            const temp = column.tiles[curIndex + operator];
            column.tiles[curIndex + operator] = tile;
            column.tiles[curIndex] = temp;

            // Get the column element
            let columnEl: Element | undefined;
            if (mode === 'single') {
              columnEl = this.#getColumnEl(this.#singleColumn);
            } else {
              columnEl = this.#getColumnEl(this.#columns?.toArray()[colIndex]);
            }

            // Move the tile element in the document
            if (curIndex + operator === column.tiles.length - 1) {
              columnEl?.appendChild(
                tileComponentInstance.location.nativeElement,
              );
            } else {
              columnEl?.insertBefore(
                tileComponentInstance.location.nativeElement,
                this.getTileComponent(column.tiles[curIndex + operator + 1].id)
                  ?.location.nativeElement,
              );
            }

            // Report the change in configuration
            const reportConfig = this.#config;
            reportConfig.movedTile = {
              tileDescription:
                tileDescription || /* istanbul ignore next */ tile.id,
              column: mode === 'single' ? 1 : colIndex + 1,
              position: curIndex + operator + 1,
            };
            this.configChange.emit(reportConfig);
          }
        }
      }
    }
  }

  #getTileId(tile: SkyTileComponent | undefined): string | undefined {
    if (tile) {
      let el = tile.elementRef.nativeElement;
      let tileId: string;

      while (el) {
        tileId = el.getAttribute(ATTR_TILE_ID);

        if (tileId) {
          return tileId;
        }

        el = el.parentElement;
      }
    }

    return undefined;
  }

  #getTileOrRemoveFromLayout(
    layoutTile: SkyTileDashboardConfigLayoutTile,
  ): SkyTileDashboardConfigTile | undefined {
    /*istanbul ignore else */
    if (layoutTile && this.#config) {
      for (const tile of this.#config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile;
        }
      }

      // If the layout tile was not found in the list of tiles, it was removed since last the user updated settings
      /*istanbul ignore else */
      if (this.#config?.layout.singleColumn) {
        this.#config.layout.singleColumn.tiles =
          this.#config.layout.singleColumn.tiles.filter(
            (elem) => elem.id !== layoutTile.id,
          );
      }

      /*istanbul ignore else */
      if (this.#config?.layout.multiColumn) {
        this.#config.layout.multiColumn.forEach((elem) => {
          elem.tiles = elem.tiles.filter((res) => res.id !== layoutTile.id);
        });
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  #checkReadyAndLoadTiles(): void {
    if (this.#config && this.#columns) {
      this.#loadTiles(this.#config);
      this.dashboardInitialized.emit();
    }
  }

  #loadTiles(config: SkyTileDashboardConfig): void {
    const layout = config.layout;

    if (this.#mode === 'single') {
      for (const tile of layout.singleColumn.tiles) {
        this.#loadTileIntoColumn(this.#singleColumn, tile);
      }
    } else {
      let columns: SkyTileDashboardColumnComponent[] = [];
      /*istanbul ignore else */
      if (this.#columns) {
        columns = this.#columns?.toArray();
      }

      for (let i = 0, n = layout.multiColumn.length; i < n; i++) {
        const column = columns[i];

        for (const tile of layout.multiColumn[i].tiles) {
          this.#loadTileIntoColumn(column, tile);
        }
      }
    }
  }

  #loadTileIntoColumn(
    column: SkyTileDashboardColumnComponent | undefined,
    layoutTile: SkyTileDashboardConfigLayoutTile,
  ): void {
    if (column) {
      const tile = this.#getTileOrRemoveFromLayout(layoutTile);

      /*istanbul ignore else */
      if (tile && this.#dynamicComponentService) {
        const componentType = tile.componentType;
        const providers = tile.providers /* istanbul ignore next */ || [];

        const componentRef = this.#dynamicComponentService.createComponent(
          componentType,
          {
            location: SkyDynamicComponentLocation.ElementBottom,
            providers: providers,
            viewContainerRef: column.content,
            environmentInjector: column.injector,
          },
        );

        this.addTileComponent(layoutTile, componentRef);

        // Make sure the component is marked for changes in case the parent component uses
        // the OnPush change detection strategy.
        componentRef.changeDetectorRef.markForCheck();
      }
    }
  }

  #moveTilesToSingleColumn(): void {
    this.#moveTilesToColumn(
      this.#singleColumn,
      this.#config?.layout.singleColumn.tiles,
    );
  }

  #moveTilesToMultiColumn(): void {
    let layoutColumns: SkyTileDashboardConfigLayoutColumn[] = [];
    /*istanbul ignore else */
    if (this.#config) {
      layoutColumns = this.#config.layout.multiColumn;
    }
    let columns: SkyTileDashboardColumnComponent[] = [];
    /*istanbul ignore else */
    if (this.#columns) {
      columns = this.#columns?.toArray();
    }

    for (let i = 0, n = layoutColumns.length; i < n; i++) {
      this.#moveTilesToColumn(columns[i], layoutColumns[i].tiles);
    }
  }

  #moveTilesToColumn(
    column: SkyTileDashboardColumnComponent | undefined,
    layoutTiles: SkyTileDashboardConfigLayoutTile[] | undefined,
  ): void {
    if (column && layoutTiles) {
      const columnEl = this.#getColumnEl(column);

      for (const layoutTile of layoutTiles) {
        const tileComponentInstance = this.getTileComponent(layoutTile.id);

        /*istanbul ignore else */
        if (tileComponentInstance) {
          columnEl?.appendChild(tileComponentInstance.location.nativeElement);
        }
      }
    }
  }

  #getConfigForUIState(): SkyTileDashboardConfig | undefined {
    /*istanbul ignore else */
    if (this.#config) {
      this.#config = {
        tiles: this.#config.tiles,
        layout: {
          singleColumn: this.#getSingleColumnLayoutForUIState(this.#config),
          multiColumn: this.#getMultiColumnLayoutForUIState(this.#config),
        },
      };
    }

    return this.#config;
  }

  #getSingleColumnLayoutForUIState(
    config: SkyTileDashboardConfig,
  ): SkyTileDashboardConfigLayoutColumn {
    if (this.#mode === 'single') {
      return {
        tiles: this.#getTilesInEl(this.#getColumnEl(this.#singleColumn)),
      };
    }

    return config.layout.singleColumn;
  }

  #getMultiColumnLayoutForUIState(
    config: SkyTileDashboardConfig,
  ): SkyTileDashboardConfigLayoutColumn[] {
    if (this.#mode === 'multi') {
      const layoutColumns: SkyTileDashboardConfigLayoutColumn[] = [];
      let columns: SkyTileDashboardColumnComponent[] = [];
      /*istanbul ignore else */
      if (this.#columns) {
        columns = this.#columns?.toArray();
      }

      for (const column of columns) {
        if (column !== this.#singleColumn) {
          const layoutColumn: SkyTileDashboardConfigLayoutColumn = {
            tiles: this.#getTilesInEl(this.#getColumnEl(column)),
          };

          layoutColumns.push(layoutColumn);
        }
      }

      return layoutColumns;
    }

    return config.layout.multiColumn;
  }

  #getTilesInEl(el: Element | undefined): SkyTileDashboardConfigLayoutTile[] {
    const tileEls = el?.querySelectorAll('[' + ATTR_TILE_ID + ']');
    const layoutTiles: SkyTileDashboardConfigLayoutTile[] = [];

    /*istanbul ignore else */
    if (tileEls) {
      for (let i = 0, n = tileEls.length; i < n; i++) {
        const tileEl = tileEls[i];
        const tileId = tileEl.getAttribute(ATTR_TILE_ID);
        const tile = this.#findTile(tileId);

        /*istanbul ignore else */
        if (tile) {
          layoutTiles.push(tile);
        }
      }
    }

    return layoutTiles;
  }

  #initDragula(): void {
    this.#dragulaService.createGroup(this.bagId, {
      moves: (el, container, handle) => {
        const target = el?.querySelector('.sky-tile-grab-handle');
        return !!target && target.contains(handle!);
      },
    });

    this.#dragulaService.drop(this.bagId).subscribe(() => {
      const config = this.#getConfigForUIState();

      /*istanbul ignore else */
      if (config) {
        if (this.#settingsKey) {
          this.#setUserConfig(config);
        }

        this.configChange.emit(config);
      }
    });
  }

  #getColumnEl(
    column: SkyTileDashboardColumnComponent | undefined,
  ): Element | undefined {
    return column?.content?.element.nativeElement.parentNode;
  }

  #findTile(
    tileId: string | undefined | null,
  ): SkyTileDashboardConfigLayoutTile | undefined {
    /*istanbul ignore else */
    if (this.#config && this.#config.layout.multiColumn) {
      for (const column of this.#config.layout.multiColumn) {
        /*istanbul ignore else */
        if (column.tiles) {
          for (const tile of column.tiles) {
            if (tile.id === tileId) {
              return tile;
            }
          }
        }
      }
    }

    return undefined;
  }

  #findTileColumn(
    tileId: string | undefined,
  ): SkyTileDashboardConfigLayoutColumn | undefined {
    /*istanbul ignore else */
    if (this.#config && this.#config.layout.multiColumn) {
      return this.#config.layout.multiColumn.find(
        (col) => col.tiles && !!col.tiles.find((tile) => tile.id === tileId),
      );
    }

    /*istanbul ignore next */
    return undefined;
  }

  #initToDefaults(
    config: SkyTileDashboardConfig,
    columns: QueryList<SkyTileDashboardColumnComponent> | undefined,
    singleColumn: SkyTileDashboardColumnComponent | undefined,
  ): void {
    this.#config = config;
    this.#columns = columns;
    this.#singleColumn = singleColumn;
    this.#checkReadyAndLoadTiles();
  }

  #setUserConfig(config?: SkyTileDashboardConfig): void {
    if (config && this.#settingsKey)
      this.#uiConfigService
        .setConfig(this.#settingsKey, {
          layout: config.layout,
          persisted: true,
          tileIds: config.tiles.map((elem) => elem.id),
        })
        .subscribe(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          (err) => {
            console.warn('Could not save tile dashboard settings.');
            console.warn(err);
          },
        );
  }

  #checkForNewTiles(oldUserTiles: string[]): void {
    // Get a list of tiles that are in the config's default list but not in the user's settings
    const newTiles = this.#config?.tiles.filter((elem) => {
      return oldUserTiles.indexOf(elem.id) === -1;
    });

    const multiColumn = this.#config?.layout.multiColumn;
    const singleColumn = this.#config?.layout.singleColumn;

    // Append new tiles to the end of the layouts
    /*istanbul ignore else */
    if (newTiles?.length) {
      /*istanbul ignore else */
      if (multiColumn) {
        newTiles?.forEach((elem) => {
          let locationToAdd = 0;
          let smallest = multiColumn[0].tiles.length;
          multiColumn.forEach((item, index) => {
            if (item.tiles.length < smallest) {
              locationToAdd = index;
              smallest = item.tiles.length;
            }
          });
          multiColumn[locationToAdd].tiles.push({
            id: elem.id,
            isCollapsed: false,
          });
        });
      }

      /*istanbul ignore else */
      if (singleColumn) {
        newTiles?.forEach((elem) => {
          singleColumn.tiles.push({ id: elem.id, isCollapsed: false });
        });
      }
    }

    /*istanbul ignore else */
    if (singleColumn) {
      for (const tile of singleColumn.tiles) {
        this.#getTileOrRemoveFromLayout(tile);
      }
    }

    /*istanbul ignore else */
    if (multiColumn) {
      for (let i = 0, n = multiColumn.length; i < n; i++) {
        for (const tile of multiColumn[i].tiles) {
          this.#getTileOrRemoveFromLayout(tile);
        }
      }
    }
  }
}
