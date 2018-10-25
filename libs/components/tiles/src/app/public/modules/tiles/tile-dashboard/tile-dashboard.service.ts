import {
  ComponentRef,
  EventEmitter,
  Injectable,
  QueryList,
  ReflectiveInjector,
  Output
} from '@angular/core';

import {
  DragulaService
} from 'ng2-dragula/ng2-dragula';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyTileComponent,
  SkyTileDashboardColumnComponent,
  SkyTileDashboardConfig,
  SkyTileDashboardConfigLayoutColumn,
  SkyTileDashboardConfigLayoutTile,
  SkyTileDashboardConfigTile
} from '..';

const ATTR_TILE_ID = '_sky-tile-dashboard-tile-id';

let bagIdIndex = 0;

@Injectable()
export class SkyTileDashboardService {
  public bagId: string;

  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  @Output()
  public dashboardInitialized = new EventEmitter<void>();

  private tileComponents: ComponentRef<SkyTileComponent>[];

  private config: SkyTileDashboardConfig;

  private columns: QueryList<SkyTileDashboardColumnComponent>;

  private singleColumn: SkyTileDashboardColumnComponent;

  private mediaSubscription: Subscription;

  constructor(
    private dragulaService: DragulaService,
    private mediaQuery: SkyMediaQueryService
  ) {
    this.bagId = 'sky-tile-dashboard-bag-' + (++bagIdIndex);

    this.initMediaQueries();
    this.initDragula();
  }

  public init(
    config: SkyTileDashboardConfig,
    columns?: QueryList<SkyTileDashboardColumnComponent>,
    singleColumn?: SkyTileDashboardColumnComponent
  ) {
    this.config = config;
    this.columns = columns;
    this.singleColumn = singleColumn;

    this.checkReadyAndLoadTiles();
  }

  public addTileComponent(
    tile: SkyTileDashboardConfigLayoutTile,
    component: ComponentRef<any>
  ) {
    this.tileComponents = this.tileComponents || [];

    this.tileComponents.push(component);

    component.location.nativeElement.setAttribute(ATTR_TILE_ID, tile.id);
  }

  public tileIsCollapsed(tile: SkyTileComponent): boolean {
    let tileConfig = this.findTile(this.getTileId(tile));

    if (tileConfig) {
      return tileConfig.isCollapsed;
    }

    return undefined;
  }

  public setTileCollapsed(tile: SkyTileComponent, isCollapsed: boolean) {
    let tileConfig = this.findTile(this.getTileId(tile));

    if (tileConfig) {
      tileConfig.isCollapsed = isCollapsed;
      this.configChange.emit(this.config);
    }
  }

  public getTileComponentType(layoutTile: SkyTileDashboardConfigLayoutTile): any {
    if (layoutTile) {
      for (let tile of this.config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile.componentType;
        }
      }
    }

    return undefined;
  }

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

  public getTileComponent(tileId: string): ComponentRef<any> {
    for (let tileComponent of this.tileComponents) {
      if (tileComponent.location.nativeElement.getAttribute(ATTR_TILE_ID) === tileId) {
        return tileComponent;
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  public destroy() {
    /*istanbul ignore else */
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
  }

  public moveTileOnKeyDown(tileCmp: SkyTileComponent, direction: string, tileDescription: string) {
    const isSingleColumnMode = this.mediaQuery.current === SkyMediaBreakpoints.xs
      || this.mediaQuery.current === SkyMediaBreakpoints.sm;

    let tileId = this.getTileId(tileCmp);
    let tile = this.findTile(tileId);

    let column: SkyTileDashboardConfigLayoutColumn;
    let colIndex: number;
    if (isSingleColumnMode) {
      column = this.config.layout.singleColumn;
    } else {
      column = this.findTileColumn(tileId);
      colIndex = this.config.layout.multiColumn.findIndex((value) => value === column);
    }

    if ((direction === 'left' || direction === 'right') && !isSingleColumnMode) {
      let operator = direction === 'left' ? -1 : 1;
      let newColumn = this.config.layout.multiColumn[colIndex + operator];

      if (newColumn) {
        // Move the tile to the end of the new column
        newColumn.tiles.push(tile);
        column.tiles = column.tiles.filter(item => item !== tile);
        this.moveTilesToColumn(this.columns.toArray()[colIndex + operator], [tile]);

        // Report the change in configuration
        let reportConfig = this.config;
        reportConfig.movedTile = {
          tileDescription: tileDescription || tile.id,
          column: colIndex + operator + 1,
          position: newColumn.tiles.length
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
            this.getTileComponent(column.tiles[curIndex + operator + 1].id).location.nativeElement
          );
        }

        // Report the change in configuration
        let reportConfig = this.config;
        reportConfig.movedTile = {
          tileDescription: tileDescription || tile.id,
          column: isSingleColumnMode ? undefined : colIndex + 1,
          position: curIndex + operator + 1
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

  private getTile(layoutTile: SkyTileDashboardConfigLayoutTile): SkyTileDashboardConfigTile {
    /*istanbul ignore else */
    if (layoutTile) {
      for (let tile of this.config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile;
        }
      }
    }

    /*istanbul ignore next */
    return undefined;
  }

  private checkReadyAndLoadTiles() {
    if (this.config && this.columns) {
      this.loadTiles();
      this.dashboardInitialized.emit();
    }
  }

  private loadTiles() {
    let layout = this.config.layout;

    if (
      this.mediaQuery.current === SkyMediaBreakpoints.xs
      || this.mediaQuery.current === SkyMediaBreakpoints.sm) {
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
    let tile = this.getTile(layoutTile);

    let componentType = tile.componentType;
    let providers = tile.providers /* istanbul ignore next */ || [];

    let resolvedProviders = ReflectiveInjector.resolve(providers);

    let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, column.injector);

    let factory = column.resolver.resolveComponentFactory(componentType);
    let componentRef = column.content.createComponent(factory, undefined, injector);

    this.addTileComponent(layoutTile, componentRef);

    // Make sure the component is marked for changes in case the parent component uses
    // the OnPush change detection strategy.
    componentRef.changeDetectorRef.markForCheck();
  }

  private moveTilesToSingleColumn() {
    this.moveTilesToColumn(this.singleColumn, this.config.layout.singleColumn.tiles);
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
        columnEl.appendChild(
          tileComponentInstance.location.nativeElement
        );
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
          multiColumn: this.getMultiColumnLayoutForUIState()
        }
      };
    }

    return this.config;
  }

  private getSingleColumnLayoutForUIState(): SkyTileDashboardConfigLayoutColumn {
    if (this.mediaQuery.current === SkyMediaBreakpoints.xs
      || this.mediaQuery.current === SkyMediaBreakpoints.sm) {
      return {
        tiles: this.getTilesInEl(this.getColumnEl(this.singleColumn))
      };
    }

    return this.config.layout.singleColumn;
  }

  private getMultiColumnLayoutForUIState(): SkyTileDashboardConfigLayoutColumn[] {
    if (!(this.mediaQuery.current === SkyMediaBreakpoints.xs
      || this.mediaQuery.current === SkyMediaBreakpoints.sm)) {
      let layoutColumns: SkyTileDashboardConfigLayoutColumn[] = [];
      let columns = this.columns.toArray();

      for (let column of columns) {
        if (column !== this.singleColumn) {
          let layoutColumn: SkyTileDashboardConfigLayoutColumn = {
            tiles: this.getTilesInEl(this.getColumnEl(column))
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
    this.mediaSubscription = this.mediaQuery.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.changeColumnMode(args === SkyMediaBreakpoints.xs || args === SkyMediaBreakpoints.sm);
      }
    );
  }

  private initDragula() {
    this.dragulaService.setOptions(this.bagId, {
      moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
        const target = el.querySelector('.sky-tile-grab-handle');
        return target.contains(handle);
      }
    });

    this.dragulaService.drop.subscribe((value: any[]) => {
      let config = this.getConfigForUIState();

      /*istanbul ignore else */
      if (config) {
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
        col => col.tiles && !!col.tiles.find(tile => tile.id === tileId)
      );
    }

    /*istanbul ignore next */
    return undefined;
  }
}
