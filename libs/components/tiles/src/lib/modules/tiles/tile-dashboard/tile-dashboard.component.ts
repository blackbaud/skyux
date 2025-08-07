import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyTileDashboardColumnComponent } from '../tile-dashboard-column/tile-dashboard-column.component';
import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';

import { SkyTileDashboardMessage } from './tile-dashboard-message';
import { SkyTileDashboardMessageType } from './tile-dashboard-message-type';
import { SkyTileDashboardService } from './tile-dashboard.service';

/**
 * Specifies a container to group multiple tiles.
 */
@Component({
  selector: 'sky-tile-dashboard',
  styleUrls: ['./tile-dashboard.component.scss'],
  templateUrl: './tile-dashboard.component.html',
  providers: [SkyTileDashboardService],
  host: {
    '[class]': 'layoutClassName()',
  },
  standalone: false,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyTileDashboardComponent implements AfterViewInit, OnDestroy {
  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  /**
   * Populates the tile dashboard based on the `SkyTileDashboardConfig` object.
   * @required
   */
  @Input()
  public set config(value: SkyTileDashboardConfig | undefined) {
    if (value && !this.#configSet) {
      this.#_config = value;
      this.#configSet = true;
      this.#checkReady();
    }
  }

  public get config(): SkyTileDashboardConfig | undefined {
    return this.#_config;
  }

  /**
   * The observable to send commands to the tile dashboard. The commands must respect the
   * `SkyTileDashboardMessage` type.
   */
  @Input()
  public messageStream = new Subject<SkyTileDashboardMessage>();

  /**
   * The unique key for the UI Config Service to retrieve stored settings
   * from a database. The UI Config Service saves configuration settings for users
   * to preserve the layout and collapsed state of tile dashboards. The UI Config Service relies on `id` values from the `config` property to maintain user settings. For more information
   * about the UI Config Service, see the
   * [sticky settings documentation](https://developer.blackbaud.com/skyux/learn/develop/sticky-settings).
   */
  @Input()
  public settingsKey: string | undefined;

  /**
   * Fires when the tile dashboard changes state and emits a SkyTileDashboardConfig
   * object. This occurs when tiles collapse or expand and when users drag and drop
   * tiles to rearrange them.
   */
  @Output()
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  @ViewChildren(SkyTileDashboardColumnComponent)
  public columns: QueryList<SkyTileDashboardColumnComponent> | undefined;

  @ViewChild('singleColumn', {
    read: SkyTileDashboardColumnComponent,
    static: false,
  })
  public singleColumn: SkyTileDashboardColumnComponent | undefined;

  public tileMovedReport = '';

  public moveInstructionsId: string;

  protected layoutClassName = computed(() => {
    const breakpoint = this.#breakpoint();

    let layoutClassName = '';

    if (breakpoint === 'xs' || breakpoint === 'sm') {
      layoutClassName = 'sky-tile-dashboard-single-column';
    } else {
      layoutClassName = 'sky-tile-dashboard-multi-column';
    }

    if (breakpoint === 'xs') {
      layoutClassName += ' sky-tile-dashboard-xs';
    } else {
      layoutClassName += ' sky-tile-dashboard-gt-xs';
    }

    return layoutClassName;
  });

  #configSet = false;
  #dashboardService: SkyTileDashboardService;
  #ngUnsubscribe = new Subject<void>();
  #resourcesService: SkyLibResourcesService | undefined;
  #viewReady = false;
  #viewReadyTimer: ReturnType<typeof setTimeout> | undefined;
  #_config: SkyTileDashboardConfig | undefined;

  constructor(
    dashboardService: SkyTileDashboardService,
    @Optional() resourcesService?: SkyLibResourcesService,
  ) {
    this.#dashboardService = dashboardService;
    this.#resourcesService = resourcesService;
    this.moveInstructionsId =
      this.#dashboardService.bagId + '-move-instructions';

    this.#dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        this.configChange.emit(config);

        // Update aria live region with tile drag info
        if (config.movedTile && this.#resourcesService) {
          let messageObservable: Observable<string>;

          if (this.#breakpoint() === 'xs' || this.#breakpoint() === 'sm') {
            messageObservable = this.#resourcesService.getString(
              'skyux_tile_moved_assistive_text',
              config.movedTile.tileDescription,
              '1',
              '1',
              config.movedTile.position.toString(),
              config.layout.singleColumn.tiles.length.toString(),
            );
          } else {
            messageObservable = this.#resourcesService.getString(
              'skyux_tile_moved_assistive_text',
              config.movedTile.tileDescription,
              config.movedTile.column.toString(),
              config.layout.multiColumn.length.toString(),
              config.movedTile.position.toString(),
              config.layout.multiColumn[
                config.movedTile.column - 1
              ].tiles.length.toString(),
            );
          }
          messageObservable.pipe(take(1)).subscribe((message: string) => {
            this.tileMovedReport = message;
          });
        }
      },
    );
  }

  public ngAfterViewInit(): void {
    this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyTileDashboardMessage) => {
        this.#handleIncomingMessages(message);
      });

    this.#viewReady = true;
    this.#checkReady();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #checkReady(): void {
    if (this.#viewReady && this.config && !this.#viewReadyTimer) {
      this.#viewReadyTimer = setTimeout(() => {
        this.#viewReadyTimer = undefined;
        if (this.config && this.columns && this.singleColumn) {
          this.#dashboardService.init(
            this.config,
            this.columns,
            this.singleColumn,
            this.settingsKey,
          );
        }
      }, 0);
    }
  }

  #handleIncomingMessages(message: SkyTileDashboardMessage): void {
    switch (message.type) {
      case SkyTileDashboardMessageType.ExpandAll:
        this.#dashboardService.setAllTilesCollapsed(false);
        break;

      case SkyTileDashboardMessageType.CollapseAll:
        this.#dashboardService.setAllTilesCollapsed(true);
        break;
    }
  }
}
