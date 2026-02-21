import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import {
  ComponentRef,
  DestroyRef,
  EventEmitter,
  Injectable,
  Injector,
  Output,
  QueryList,
  RendererFactory2,
  afterNextRender,
  computed,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDynamicComponentService,
  SkyMediaQueryService,
  SkyUIConfigService,
} from '@skyux/core';

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

  readonly #destroyRef = inject(DestroyRef);
  readonly #dragDrop = inject(DragDrop);
  readonly #injector = inject(Injector);
  readonly #dragRefs: DragRef[] = [];
  readonly #dropListRefs: DropListRef[] = [];
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);
  readonly #uiConfigService = inject(SkyUIConfigService);

  readonly #mode = computed<SkyTileDashboardColumnMode>(() => {
    const breakpoint = this.#breakpoint();

    return breakpoint === 'xs' || breakpoint === 'sm' ? 'single' : 'multi';
  });

  constructor() {
    effect(() => {
      const mode = this.#mode();
      this.changeColumnMode(mode);
    });

    this.bagId = `sky-tile-dashboard-bag-${++bagIdIndex}`;

    this.#destroyRef.onDestroy(() => {
      this.#disposeDragDrop();
    });
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
    // Clone this so changes to the config object outside of this class don't modify
    // the config used inside and vice versa.
    this.#config = Object.assign({}, config) as SkyTileDashboardConfig;

    // Verify that all tiles are accounted for in the layout.
    const tileIds = [
      ...new Set([
        ...this.#config.layout.multiColumn.flatMap((column) =>
          column.tiles.map(({ id }) => id),
        ),
        ...this.#config.layout.singleColumn.tiles.map(({ id }) => id),
      ]),
    ];
    this.#checkForNewTiles(this.#config, tileIds);

    if (settingsKey) {
      this.#settingsKey = settingsKey;

      this.#uiConfigService
        .getConfig(settingsKey, this.#config)
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (value: any) => {
            if (this.#config && value.persisted) {
              this.#config.layout = value.layout;
              this.#checkForNewTiles(this.#config, value.tileIds);
              this.configChange.emit(this.#config);
            }
            this.#checkReadyAndLoadTiles(columns, singleColumn);
          },
          error: () => {
            // Config setting key doesn't exist or other config service error
            this.#checkReadyAndLoadTiles(columns, singleColumn);
          },
        });
    } else {
      this.#checkReadyAndLoadTiles(columns, singleColumn);
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
    if (this.#config) {
      if (mode === 'single') {
        this.#moveTilesToSingleColumn();
      } else {
        this.#moveTilesToMultiColumn();
      }
      this.#syncDragDropItems();
    }
  }

  /**
   * @internal
   */
  public getTileComponent(tileId: string): ComponentRef<any> | undefined {
    return this.#tileComponents?.find(
      (tileComponent) =>
        tileComponent.location.nativeElement.getAttribute(ATTR_TILE_ID) ===
        tileId,
    );
  }

  /**
   * @internal
   */
  public moveTileOnKeyDown(
    tileCmp: SkyTileComponent,
    direction: 'up' | 'down' | 'left' | 'right',
    tileDescription: string,
  ): void {
    if (this.#config) {
      const mode = this.#mode();
      const tileId = this.#getTileId(tileCmp);
      const tile = this.#findTile(tileId);

      let column: SkyTileDashboardConfigLayoutColumn | undefined;
      let colIndex = 0;

      if (mode === 'single') {
        column = this.#config.layout.singleColumn;
      } else if (this.#config.layout.multiColumn) {
        colIndex = this.#findTileColumnIndex(
          this.#config.layout.multiColumn,
          tileId,
        );
        column = this.#config.layout.multiColumn[colIndex];
      }

      if (column && tile && tileId) {
        if (direction === 'left' || direction === 'right') {
          if (mode === 'multi') {
            this.#moveTileArrowLeftRight(
              tile,
              tileDescription,
              direction,
              colIndex,
              column,
              this.#config.layout.multiColumn,
            );
          }
        } else {
          // Get the column element
          let columnEl: Element | undefined;
          if (mode === 'single') {
            columnEl = this.#getColumnEl(this.#singleColumn);
          } else {
            columnEl = this.#getColumnEl(this.#columns?.toArray()[colIndex]);
          }
          this.#moveTileArrowUpDown(
            tile,
            tileDescription,
            direction,
            colIndex,
            column,
            columnEl,
          );
        }
      }
    }
  }

  #moveTileArrowLeftRight(
    tile: SkyTileDashboardConfigLayoutTile,
    tileDescription: string,
    direction: 'left' | 'right',
    colIndex: number,
    column: SkyTileDashboardConfigLayoutColumn,
    multiColumn: SkyTileDashboardConfigLayoutColumn[],
  ): void {
    const operator = direction === 'left' ? -1 : 1;
    const newColumn = multiColumn[colIndex + operator];

    if (newColumn) {
      // Move the tile to the end of the new column
      newColumn.tiles.push(tile);
      column.tiles = column.tiles.filter((item) => item !== tile);
      this.#moveTilesToColumn(this.#columns?.toArray()[colIndex + operator], [
        tile,
      ]);

      this.#syncDragDropItems();

      // Report the change in configuration
      this.#emitTileMove(
        tileDescription,
        tile,
        colIndex + operator + 1,
        newColumn.tiles.length,
      );
    }
  }

  #moveTileArrowUpDown(
    tile: SkyTileDashboardConfigLayoutTile,
    tileDescription: string,
    direction: 'up' | 'down',
    colIndex: number,
    column: SkyTileDashboardConfigLayoutColumn,
    columnEl: Element | undefined,
  ): void {
    const operator = direction === 'up' ? -1 : 1;
    const curIndex = column.tiles.findIndex((value) => value.id === tile.id);
    const tileComponentInstance = this.getTileComponent(tile.id);

    if (tileComponentInstance && column.tiles[curIndex + operator]) {
      const temp = column.tiles[curIndex + operator];
      column.tiles[curIndex + operator] = tile;
      column.tiles[curIndex] = temp;

      if (columnEl) {
        // Move the tile element in the document
        if (curIndex + operator === column.tiles.length - 1) {
          this.#renderer.appendChild(
            columnEl,
            tileComponentInstance.location.nativeElement,
          );
        } else {
          this.#renderer.insertBefore(
            columnEl,
            tileComponentInstance.location.nativeElement,
            this.getTileComponent(column.tiles[curIndex + operator + 1].id)
              ?.location.nativeElement,
          );
        }
      }

      this.#syncDragDropItems();

      // Report the change in configuration
      this.#emitTileMove(
        tileDescription,
        tile,
        colIndex + 1,
        curIndex + operator + 1,
      );
    }
  }

  #emitTileMove(
    tileDescription: string,
    tile: SkyTileDashboardConfigLayoutTile,
    newColumnIndex: number,
    newRowIndex: number,
  ): void {
    const reportConfig = this.#getConfigForUIState();
    if (reportConfig) {
      if (this.#settingsKey) {
        this.#setUserConfig({ ...reportConfig });
      }
      reportConfig.movedTile = {
        tileDescription: this.#getTileDescription(tileDescription, tile),
        column: newColumnIndex,
        position: newRowIndex,
      };
      this.configChange.emit(reportConfig);
    }
  }

  #getTileDescription(
    tileDescription: string,
    tile: SkyTileDashboardConfigLayoutTile,
  ): string {
    return tileDescription || tile.id;
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
    if (layoutTile && this.#config) {
      for (const tile of this.#config.tiles) {
        if (tile.id === layoutTile.id) {
          return tile;
        }
      }

      // If the layout tile was not found in the list of tiles, it was removed since last the user updated settings
      if (this.#config?.layout.singleColumn) {
        this.#config.layout.singleColumn.tiles =
          this.#config.layout.singleColumn.tiles.filter(
            (elem) => elem.id !== layoutTile.id,
          );
      }

      this.#config?.layout.multiColumn.forEach((elem) => {
        elem.tiles = elem.tiles.filter((res) => res.id !== layoutTile.id);
      });
    }

    return undefined;
  }

  #checkReadyAndLoadTiles(
    columns: QueryList<SkyTileDashboardColumnComponent> | undefined,
    singleColumn: SkyTileDashboardColumnComponent | undefined,
  ): void {
    this.#columns = columns;
    this.#singleColumn = singleColumn;
    if (this.#config && this.#columns) {
      this.#loadTiles(this.#config, this.#columns.toArray());
      this.#initDragDrop();
      this.dashboardInitialized.emit();
    }
  }

  #loadTiles(
    config: SkyTileDashboardConfig,
    columns: SkyTileDashboardColumnComponent[],
  ): void {
    const layout = config.layout;

    if (this.#mode() === 'single') {
      for (const tile of layout.singleColumn.tiles) {
        this.#loadTileIntoColumn(this.#singleColumn, tile);
      }
    } else {
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

      if (tile && this.#dynamicComponentService) {
        const componentType = tile.componentType;
        const providers = tile.providers ?? [];

        const componentRef = this.#dynamicComponentService.createComponent(
          componentType,
          {
            providers: providers,
            viewContainerRef: column.content,
            environmentInjector: column.injector,
            className: 'sky-tile-parent',
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
    if (this.#config) {
      layoutColumns = this.#config.layout.multiColumn;
    }
    const columns: SkyTileDashboardColumnComponent[] =
      this.#columns?.toArray() ?? [];

    for (let i = 0, n = layoutColumns.length; i < n; i++) {
      this.#moveTilesToColumn(columns[i], layoutColumns[i].tiles);
    }
  }

  #moveTilesToColumn(
    column: SkyTileDashboardColumnComponent | undefined,
    layoutTiles: SkyTileDashboardConfigLayoutTile[] | undefined,
  ): void {
    const columnEl = this.#getColumnEl(column);
    if (columnEl && layoutTiles) {
      for (const layoutTile of layoutTiles) {
        const tileComponentInstance = this.getTileComponent(layoutTile.id);
        if (tileComponentInstance) {
          this.#renderer.appendChild(
            columnEl,
            tileComponentInstance.location.nativeElement,
          );
        }
      }
    }
  }

  #getConfigForUIState(): SkyTileDashboardConfig | undefined {
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
    if (this.#mode() === 'single') {
      return {
        tiles: this.#getTilesInEl(this.#getColumnEl(this.#singleColumn)),
      };
    }

    return config.layout.singleColumn;
  }

  #getMultiColumnLayoutForUIState(
    config: SkyTileDashboardConfig,
  ): SkyTileDashboardConfigLayoutColumn[] {
    if (this.#mode() === 'multi') {
      const layoutColumns: SkyTileDashboardConfigLayoutColumn[] = [];
      let columns: SkyTileDashboardColumnComponent[] = [];
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

    if (tileEls) {
      for (let i = 0, n = tileEls.length; i < n; i++) {
        const tileEl = tileEls[i];
        const tileId = tileEl.getAttribute(ATTR_TILE_ID);
        const tile = this.#findTile(tileId);

        if (tile) {
          layoutTiles.push(tile);
        }
      }
    }

    return layoutTiles;
  }

  /**
   * @internal
   * Handles a tile drop event by reading the current DOM state and emitting
   * the updated configuration.
   */
  public handleDrop(): void {
    const config = this.#getConfigForUIState();

    if (config) {
      if (this.#settingsKey) {
        this.#setUserConfig(config);
      }

      this.configChange.emit(config);
    }
  }

  #moveDomElement(event: {
    item: DragRef;
    container: DropListRef;
    previousContainer: DropListRef;
    previousIndex: number;
    currentIndex: number;
  }): void {
    const element = event.item.getRootElement();
    const targetContainer = event.container.element as HTMLElement;

    // Get the tile elements currently in the target container (excluding the dragged item).
    const tileChildren = Array.from(
      targetContainer.querySelectorAll(
        ':scope > [_sky-tile-dashboard-tile-id]',
      ),
    ).filter((el) => el !== element);

    const referenceNode = tileChildren[event.currentIndex];

    if (referenceNode) {
      targetContainer.insertBefore(element, referenceNode);
    } else {
      targetContainer.appendChild(element);
    }
  }

  #initDragDrop(): void {
    this.#disposeDragDrop();

    const allColumns = this.#columns!.toArray();

    for (const column of allColumns) {
      const columnEl = this.#getColumnEl(column);

      if (columnEl) {
        const dropListRef = this.#dragDrop.createDropList(columnEl);
        dropListRef.withOrientation('vertical');

        dropListRef.dropped.subscribe((event) => {
          this.#moveDomElement(event);
          this.handleDrop();
          this.#syncDragDropItems();
        });

        this.#dropListRefs.push(dropListRef);
      }
    }

    // Connect all drop lists for cross-column dragging.
    for (const ref of this.#dropListRefs) {
      ref.connectedTo(this.#dropListRefs.filter((r) => r !== ref));
    }

    // Defer drag ref creation to after Angular renders tile templates
    // so that grab handle elements are available.
    afterNextRender(
      () => {
        this.#initDragRefs();
      },
      { injector: this.#injector },
    );
  }

  #initDragRefs(): void {
    if (this.#tileComponents) {
      for (const tileComponent of this.#tileComponents) {
        const tileEl = tileComponent.location.nativeElement as HTMLElement;
        const dragRef = this.#dragDrop.createDrag(tileEl);

        const handle = tileEl.querySelector('.sky-tile-grab-handle');

        if (handle instanceof HTMLElement) {
          dragRef.withHandles([handle]);
        }

        this.#dragRefs.push(dragRef);
      }
    }

    this.#syncDragDropItems();
  }

  #syncDragDropItems(): void {
    for (const dropListRef of this.#dropListRefs) {
      const containerEl = dropListRef.element as HTMLElement;

      const dragRefsInContainer = this.#dragRefs.filter((dragRef) =>
        containerEl.contains(dragRef.getRootElement()),
      );

      dropListRef.withItems(dragRefsInContainer);
    }
  }

  #disposeDragDrop(): void {
    for (const ref of this.#dragRefs) {
      ref.dispose();
    }
    for (const ref of this.#dropListRefs) {
      ref.dispose();
    }
    this.#dragRefs.length = 0;
    this.#dropListRefs.length = 0;
  }

  #getColumnEl(
    column: SkyTileDashboardColumnComponent | undefined,
  ): HTMLElement | undefined {
    return column?.content?.element.nativeElement.parentNode as
      | HTMLElement
      | undefined;
  }

  #findTile(
    tileId: string | undefined | null,
  ): SkyTileDashboardConfigLayoutTile | undefined {
    if (this.#config && this.#config.layout.multiColumn) {
      for (const column of this.#config.layout.multiColumn) {
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

  #findTileColumnIndex(
    multiColumn: SkyTileDashboardConfigLayoutColumn[],
    tileId: string | undefined,
  ): number {
    return multiColumn.findIndex(
      (col) => !!col.tiles?.find((tile) => tile.id === tileId),
    );
  }

  #setUserConfig(config?: SkyTileDashboardConfig): void {
    if (config && this.#settingsKey)
      this.#uiConfigService
        .setConfig(this.#settingsKey, {
          layout: config.layout,
          persisted: true,
          tileIds: config.tiles.map((elem) => elem.id),
        })
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          error: (err) => {
            console.warn('Could not save tile dashboard settings.');
            console.warn(err);
          },
        });
  }

  #checkForNewTiles(
    config: SkyTileDashboardConfig,
    oldTileIds: string[],
  ): boolean {
    // Get a list of tiles that are in the config's default list but not in the user's settings
    const newTiles = config.tiles.filter(({ id }) => !oldTileIds.includes(id));
    let hasChange = newTiles.length > 0;

    const multiColumn: SkyTileDashboardConfigLayoutColumn[] | undefined =
      config.layout.multiColumn;
    const singleColumn: SkyTileDashboardConfigLayoutColumn | undefined =
      config.layout.singleColumn;

    // Append new tiles to the end of the layouts
    if (multiColumn) {
      const multiColumnTileIds = multiColumn.flatMap((column) =>
        column.tiles.map((tile) => tile.id),
      );
      const newMultiColumnTiles = [
        ...new Set([
          ...newTiles,
          ...config.tiles.filter(
            (tile) => !multiColumnTileIds.includes(tile.id),
          ),
        ]),
      ] as SkyTileDashboardConfigTile[];
      newMultiColumnTiles.forEach((elem) => {
        const smallest = Math.min(
          ...multiColumn.map((col) => col.tiles.length),
        );
        const locationToAdd = multiColumn.findIndex(
          (col) => col.tiles.length === smallest,
        );
        multiColumn[locationToAdd].tiles.push({
          id: elem.id,
          isCollapsed: false,
        });
      });
    }

    if (singleColumn) {
      const singleColumnTileIds = singleColumn.tiles.map((tile) => tile.id);
      const newSingleColumnTiles = [
        ...new Set([
          ...newTiles,
          ...config.tiles.filter(
            (tile) => !singleColumnTileIds.includes(tile.id),
          ),
        ]),
      ] as SkyTileDashboardConfigTile[];
      newSingleColumnTiles.forEach((elem) => {
        singleColumn.tiles.push({ id: elem.id, isCollapsed: false });
      });
    }

    singleColumn?.tiles.forEach((tile) => {
      hasChange ||= !this.#getTileOrRemoveFromLayout(tile);
    });

    multiColumn?.forEach((column) => {
      column.tiles.forEach((tile) => {
        hasChange ||= !this.#getTileOrRemoveFromLayout(tile);
      });
    });

    return hasChange;
  }
}
