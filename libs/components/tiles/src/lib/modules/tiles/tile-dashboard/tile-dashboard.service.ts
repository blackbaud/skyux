import {
  ComponentRef,
  EventEmitter,
  Injectable,
  Injector,
  Output,
  QueryList,
} from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyUIConfigService,
} from '@skyux/core';

import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyTileDashboardColumnComponent } from '../tile-dashboard-column/tile-dashboard-column.component';
import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';
import { SkyTileDashboardConfigLayoutColumn } from '../tile-dashboard-config/tile-dashboard-config-layout-column';
import { SkyTileDashboardConfigLayoutTile } from '../tile-dashboard-config/tile-dashboard-config-layout-tile';
import { SkyTileDashboardConfigTile } from '../tile-dashboard-config/tile-dashboard-config-tile';
import { SkyTileComponent } from '../tile/tile.component';

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

  private tileComponents: ComponentRef<any>[];

  private config: SkyTileDashboardConfig;

  private defaultConfig: SkyTileDashboardConfig;

  private columns: QueryList<SkyTileDashboardColumnComponent>;

  private singleColumn: SkyTileDashboardColumnComponent;

  private mediaSubscription: Subscription;

  private settingsKey: string;

  constructor(
    private dragulaService: DragulaService,
    private mediaQuery: SkyMediaQueryService,
    private uiConfigService: SkyUIConfigService
  ) {
    this.bagId = 'sky-tile-dashboard-bag-' + ++bagIdIndex;

    this.initDragula();
  }

  /**
   * @internal
   */
  public init(
    config: SkyTileDashboardConfig,
    columns?: QueryList<SkyTileDashboardColumnComponent>,
    singleColumn?: SkyTileDashboardColumnComponent,
    settingsKey?: string
  ) {
    if (settingsKey) {
      // Clone this so changes to the config object outside of this class don't modify
      // the config used inside and vice versa.
      this.defaultConfig = this.config = Object.assign({}, config);

      this.settingsKey = settingsKey;

      this.uiConfigService
        .getConfig(settingsKey, config)
        .pipe(take(1))
        .subscribe(
          (value: any) => {
            if (value.persisted) {
              this.config.layout = value.layout;
              this.checkForNewTiles(value.tileIds);
              this.configChange.emit(this.config);

              this.columns = columns;
              this.singleColumn = singleColumn;
              this.checkReadyAndLoadTiles();
            } else {
              // Bad data, or config is the default config.
              this.initToDefaults(config, columns, singleColumn);
            }
          },
          (error: any) => {
            // Config setting key doesn't exist or other config service error
            this.initToDefaults(config, columns, singleColumn);
          }
        );
    } else {
      this.initToDefaults(config, columns, singleColumn);
    }
  }

  /**
   * Adds a new tile to the tile dashboard.
   * @param tile Specifies the tile configuration.
   * @param component Specifies the tile component to add.
   */
  public addTileComponent(
    tile: SkyTileDashboardConfigLayoutTile,
    component: ComponentRef<any>
  ) {
    this.tileComponents = this.tileComponents || [];

    this.tileComponents.push(component);

    component.location.nativeElement.setAttribute(ATTR_TILE_ID, tile.id);
  }

  /**
   * Checks whether a specified tile is collapsed.
   * @param tile Specifies the tile component to check.
   */
  public tileIsCollapsed(tile: SkyTileComponent): boolean {
    let tileConfig = this.findTile(this.getTileId(tile));

    if (tileConfig) {
      return tileConfig.isCollapsed;
    }

    return undefined;
  }

  /**
   * Sets the collapsed state of all tiles.
   * @param isCollapsed Indicates whether tiles are collapsed.
   */
  public setAllTilesCollapsed(isCollapsed: boolean): void {
    /*istanbul ignore else */
    if (this.config && this.config.layout.multiColumn) {
      for (let column of this.config.layout.multiColumn) {
        for (let tile of column.tiles) {
          tile.isCollapsed = isCollapsed;
        }
      }
      for (let tile of this.config.layout.singleColumn.tiles) {
        tile.isCollapsed = isCollapsed;
      }
    }

    if (this.settingsKey) {
      this.setUserConfig(this.config);
    }

    this.configChange.emit(this.config);
  }

  /**
   * Sets the collapsed state of a specified tile.
   * @param tile Specifies the tile component.
   * @param isCollapsed Indicates whether the tile is collapsed.
   */
  public setTileCollapsed(tile: SkyTileComponent, isCollapsed: boolean) {
    let tileConfig = this.findTile(this.getTileId(tile));

    if (tileConfig) {
      tileConfig.isCollapsed = isCollapsed;

      if (this.settingsKey) {
        this.setUserConfig(this.config);
      }

      this.configChange.emit(this.config);
    }
  }

  /**
   * @internal
   */
  public getTileComponentType(
    layoutTile: SkyTileDashboardConfigLayoutTile
  ): any {
    if (layoutTile) {
      for (let tile of this.config.tiles) {
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
  public changeColumnMode(isSingleColumn: boolean) {
    /*istanbul ignore else */
    if (this.config) {
      if (isSingleColumn) {
        this.moveTilesToSingleColumn();
      } else {
        this.moveTilesToMultiColumn();
      }
    }
  }

  /**
   * @internal
   */
  public getTileComponent(tileId: string): ComponentRef<any> {
    for (let tileComponent of this.tileComponents) {
      if (
        tileComponent.location.nativeElement.getAttribute(ATTR_TILE_ID) ===
        tileId
      ) {
        return tileComponent;
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  /**
   * @internal
   */
  public destroy() {
    /*istanbul ignore else */
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
  }

  /**
   * @internal
   */
  public moveTileOnKeyDown(
    tileCmp: SkyTileComponent,
    direction: string,
    tileDescription: string
  ) {
    const isSingleColumnMode =
      this.mediaQuery.current === SkyMediaBreakpoints.xs ||
      this.mediaQuery.current === SkyMediaBreakpoints.sm;

    let tileId = this.getTileId(tileCmp);
    let tile = this.findTile(tileId);

    let column: SkyTileDashboardConfigLayoutColumn;
    let colIndex: number;
    if (isSingleColumnMode) {
      column = this.config.layout.singleColumn;
    } else {
      column = this.findTileColumn(tileId);
      colIndex = this.config.layout.multiColumn.findIndex(
        (value) => value === column
      );
    }

    if (
      (direction === 'left' || direction === 'right') &&
      !isSingleColumnMode
    ) {
      let operator = direction === 'left' ? -1 : 1;
      let newColumn = this.config.layout.multiColumn[colIndex + operator];

      if (newColumn) {
        // Move the tile to the end of the new column
        newColumn.tiles.push(tile);
        column.tiles = column.tiles.filter((item) => item !== tile);
        this.moveTilesToColumn(this.columns.toArray()[colIndex + operator], [
          tile,
        ]);

        // Report the change in configuration
        let reportConfig = this.config;
        reportConfig.movedTile = {
          tileDescription:
            tileDescription || /* istanbul ignore next */ tile.id,
          column: colIndex + operator + 1,
          position: newColumn.tiles.length,
        };
        this.configChange.emit(reportConfig);
      }
    } else {
      let operator = direction === 'up' ? -1 : 1;
      let curIndex = column.tiles.findIndex((value) => value.id === tile.id);
      let tileComponentInstance = this.getTileComponent(tileId);

      if (tileComponentInstance && column.tiles[curIndex + operator]) {
        let temp = column.tiles[curIndex + operator];
        column.tiles[curIndex + operator] = tile;
        column.tiles[curIndex] = temp;

        // Get the column element
        let columnEl: Element;
        if (isSingleColumnMode) {
          columnEl = this.getColumnEl(this.singleColumn);
        } else {
          columnEl = this.getColumnEl(this.columns.toArray()[colIndex]);
        }

        // Move the tile element in the document
        if (curIndex + operator === column.tiles.length - 1) {
          columnEl.appendChild(tileComponentInstance.location.nativeElement);
        } else {
          columnEl.insertBefore(
            tileComponentInstance.location.nativeElement,
            this.getTileComponent(column.tiles[curIndex + operator + 1].id)
              .location.nativeElement
          );
        }

        // Report the change in configuration
        let reportConfig = this.config;
        reportConfig.movedTile = {
          tileDescription:
            tileDescription || /* istanbul ignore next */ tile.id,
          column: isSingleColumnMode ? undefined : colIndex + 1,
          position: curIndex + operator + 1,
        };
        this.configChange.emit(reportConfig);
      }
    }
  }

  private getTileId(tile: SkyTileComponent): string {
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

  private getTileOrRemoveFromLayout(
    layoutTile: SkyTileDashboardConfigLayoutTile
  ): SkyTileDashboardConfigTile {
    /*istanbul ignore else */
    if (layoutTile) {
      for (let tile of this.config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile;
        }
      }

      // If the layout tile was not found in the list of tiles, it was removed since last the user updated settings
      /*istanbul ignore else */
      if (this.config.layout.singleColumn) {
        this.config.layout.singleColumn.tiles =
          this.config.layout.singleColumn.tiles.filter(
            (elem) => elem.id !== layoutTile.id
          );
      }

      /*istanbul ignore else */
      if (this.config.layout.multiColumn) {
        this.config.layout.multiColumn.forEach((elem) => {
          elem.tiles = elem.tiles.filter((res) => res.id !== layoutTile.id);
        });
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  private checkReadyAndLoadTiles() {
    if (this.config && this.columns) {
      this.loadTiles();
      this.initMediaQueries();
      this.dashboardInitialized.emit();
    }
  }

  private loadTiles() {
    let layout = this.config.layout;

    if (
      this.mediaQuery.current === SkyMediaBreakpoints.xs ||
      this.mediaQuery.current === SkyMediaBreakpoints.sm
    ) {
      for (let tile of layout.singleColumn.tiles) {
        this.loadTileIntoColumn(this.singleColumn, tile);
      }
    } else {
      let columns = this.columns.toArray();

      for (let i = 0, n = layout.multiColumn.length; i < n; i++) {
        let column = columns[i];

        for (let tile of layout.multiColumn[i].tiles) {
          this.loadTileIntoColumn(column, tile);
        }
      }
    }
  }

  private loadTileIntoColumn(
    column: SkyTileDashboardColumnComponent,
    layoutTile: SkyTileDashboardConfigLayoutTile
  ) {
    let tile = this.getTileOrRemoveFromLayout(layoutTile);

    /*istanbul ignore else */
    if (tile) {
      let componentType = tile.componentType;
      let providers = tile.providers /* istanbul ignore next */ || [];

      const injector = Injector.create({
        providers,
        parent: column.injector,
      });

      const factory = column.resolver.resolveComponentFactory(componentType);
      const componentRef = column.content.createComponent(
        factory,
        undefined,
        injector
      );

      this.addTileComponent(layoutTile, componentRef);

      // Make sure the component is marked for changes in case the parent component uses
      // the OnPush change detection strategy.
      componentRef.changeDetectorRef.markForCheck();
    }
  }

  private moveTilesToSingleColumn() {
    this.moveTilesToColumn(
      this.singleColumn,
      this.config.layout.singleColumn.tiles
    );
  }

  private moveTilesToMultiColumn() {
    let layoutColumns = this.config.layout.multiColumn;
    let columns = this.columns.toArray();

    for (let i = 0, n = layoutColumns.length; i < n; i++) {
      this.moveTilesToColumn(columns[i], layoutColumns[i].tiles);
    }
  }

  private moveTilesToColumn(
    column: SkyTileDashboardColumnComponent,
    layoutTiles: SkyTileDashboardConfigLayoutTile[]
  ) {
    let columnEl = this.getColumnEl(column);

    for (let layoutTile of layoutTiles) {
      let tileComponentInstance = this.getTileComponent(layoutTile.id);

      /*istanbul ignore else */
      if (tileComponentInstance) {
        columnEl.appendChild(tileComponentInstance.location.nativeElement);
      }
    }
  }

  private getConfigForUIState(): SkyTileDashboardConfig {
    /*istanbul ignore else */
    if (this.config) {
      this.config = {
        tiles: this.config.tiles,
        layout: {
          singleColumn: this.getSingleColumnLayoutForUIState(),
          multiColumn: this.getMultiColumnLayoutForUIState(),
        },
      };
    }

    return this.config;
  }

  private getSingleColumnLayoutForUIState(): SkyTileDashboardConfigLayoutColumn {
    if (
      this.mediaQuery.current === SkyMediaBreakpoints.xs ||
      this.mediaQuery.current === SkyMediaBreakpoints.sm
    ) {
      return {
        tiles: this.getTilesInEl(this.getColumnEl(this.singleColumn)),
      };
    }

    return this.config.layout.singleColumn;
  }

  private getMultiColumnLayoutForUIState(): SkyTileDashboardConfigLayoutColumn[] {
    if (
      !(
        this.mediaQuery.current === SkyMediaBreakpoints.xs ||
        this.mediaQuery.current === SkyMediaBreakpoints.sm
      )
    ) {
      let layoutColumns: SkyTileDashboardConfigLayoutColumn[] = [];
      let columns = this.columns.toArray();

      for (let column of columns) {
        if (column !== this.singleColumn) {
          let layoutColumn: SkyTileDashboardConfigLayoutColumn = {
            tiles: this.getTilesInEl(this.getColumnEl(column)),
          };

          layoutColumns.push(layoutColumn);
        }
      }

      return layoutColumns;
    }

    return this.config.layout.multiColumn;
  }

  private getTilesInEl(el: Element): SkyTileDashboardConfigLayoutTile[] {
    let tileEls: any = el.querySelectorAll('[' + ATTR_TILE_ID + ']');
    let layoutTiles: SkyTileDashboardConfigLayoutTile[] = [];

    /*istanbul ignore else */
    if (tileEls) {
      for (let i = 0, n = tileEls.length; i < n; i++) {
        let tileEl = tileEls[i];
        let tileId = tileEl.getAttribute(ATTR_TILE_ID);
        let tile = this.findTile(tileId);

        /*istanbul ignore else */
        if (tile) {
          layoutTiles.push(tile);
        }
      }
    }

    return layoutTiles;
  }

  private initMediaQueries() {
    /*istanbul ignore else */
    if (!this.mediaSubscription) {
      this.mediaSubscription = this.mediaQuery.subscribe(
        (args: SkyMediaBreakpoints) => {
          this.changeColumnMode(
            args === SkyMediaBreakpoints.xs || args === SkyMediaBreakpoints.sm
          );
        }
      );
    }
  }

  private initDragula() {
    this.dragulaService.setOptions(this.bagId, {
      moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
        const target = el.querySelector('.sky-tile-grab-handle');
        return target.contains(handle);
      },
    });

    this.dragulaService.drop.subscribe((value: any[]) => {
      let config = this.getConfigForUIState();

      /*istanbul ignore else */
      if (config) {
        if (this.settingsKey) {
          this.setUserConfig(config);
        }

        this.configChange.emit(config);
      }
    });
  }

  private getColumnEl(column: SkyTileDashboardColumnComponent): Element {
    return column.content.element.nativeElement.parentNode;
  }

  private findTile(tileId: string): SkyTileDashboardConfigLayoutTile {
    /*istanbul ignore else */
    if (this.config && this.config.layout.multiColumn) {
      for (let column of this.config.layout.multiColumn) {
        /*istanbul ignore else */
        if (column.tiles) {
          for (let tile of column.tiles) {
            if (tile.id === tileId) {
              return tile;
            }
          }
        }
      }
    }

    return undefined;
  }

  private findTileColumn(tileId: string): SkyTileDashboardConfigLayoutColumn {
    /*istanbul ignore else */
    if (this.config && this.config.layout.multiColumn) {
      return this.config.layout.multiColumn.find(
        (col) => col.tiles && !!col.tiles.find((tile) => tile.id === tileId)
      );
    }

    /*istanbul ignore next */
    return undefined;
  }

  private initToDefaults(
    config: SkyTileDashboardConfig,
    columns: QueryList<SkyTileDashboardColumnComponent>,
    singleColumn: SkyTileDashboardColumnComponent
  ) {
    this.config = config;
    this.columns = columns;
    this.singleColumn = singleColumn;
    this.checkReadyAndLoadTiles();
  }

  private setUserConfig(config: SkyTileDashboardConfig) {
    this.uiConfigService
      .setConfig(this.settingsKey, {
        layout: this.config.layout,
        persisted: true,
        tileIds: this.defaultConfig.tiles.map((elem) => elem.id),
      })
      .subscribe(
        () => {},
        (err) => {
          console.warn('Could not save tile dashboard settings.');
          console.warn(err);
        }
      );
  }

  private checkForNewTiles(oldUserTiles: string[]) {
    // Get a list of tiles that are in the config's default list but not in the user's settings
    let newTiles = this.config.tiles.filter((elem) => {
      return oldUserTiles.indexOf(elem.id) === -1;
    });

    const { multiColumn, singleColumn } = this.config.layout;

    // Append new tiles to the end of the layouts
    /*istanbul ignore else */
    if (newTiles.length > 0) {
      /*istanbul ignore else */
      if (multiColumn) {
        newTiles.forEach((elem) => {
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
        newTiles.forEach((elem) => {
          singleColumn.tiles.push({ id: elem.id, isCollapsed: false });
        });
      }
    }

    /*istanbul ignore else */
    if (singleColumn) {
      for (let tile of singleColumn.tiles) {
        this.getTileOrRemoveFromLayout(tile);
      }
    }

    /*istanbul ignore else */
    if (multiColumn) {
      for (let i = 0, n = multiColumn.length; i < n; i++) {
        for (let tile of multiColumn[i].tiles) {
          this.getTileOrRemoveFromLayout(tile);
        }
      }
    }
  }
}
