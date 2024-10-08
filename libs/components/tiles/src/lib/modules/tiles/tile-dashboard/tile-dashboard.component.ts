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
  signal,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable, Subject, Subscription } from 'rxjs';
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
})
export class SkyTileDashboardComponent implements AfterViewInit, OnDestroy {
  protected layoutClassName = signal(
    'sky-tile-dashboard-multi-column sky-tile-dashboard-gt-xs',
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

  #configSet = false;
  #dashboardService: SkyTileDashboardService;
  #mediaQueryService: SkyMediaQueryService;
  #ngUnsubscribe = new Subject<void>();
  #subscriptions = new Subscription();
  #resourcesService: SkyLibResourcesService | undefined;
  #viewReady = false;
  #_config: SkyTileDashboardConfig | undefined;

  constructor(
    dashboardService: SkyTileDashboardService,
    mediaQueryService: SkyMediaQueryService,
    @Optional() resourcesService?: SkyLibResourcesService,
  ) {
    this.#dashboardService = dashboardService;
    this.#mediaQueryService = mediaQueryService;
    this.#resourcesService = resourcesService;
    this.moveInstructionsId =
      this.#dashboardService.bagId + '-move-instructions';

    this.#subscriptions.add(
      this.#mediaQueryService.subscribe((args: SkyMediaBreakpoints) => {
        let layoutClassName = this.layoutClassName();

        if (
          args === SkyMediaBreakpoints.xs ||
          args === SkyMediaBreakpoints.sm
        ) {
          layoutClassName = 'sky-tile-dashboard-single-column';
        } else {
          layoutClassName = 'sky-tile-dashboard-multi-column';
        }
        if (args === SkyMediaBreakpoints.xs) {
          layoutClassName += ' sky-tile-dashboard-xs';
        } else {
          layoutClassName += ' sky-tile-dashboard-gt-xs';
        }

        if (layoutClassName !== this.layoutClassName()) {
          this.layoutClassName.set(layoutClassName);
        }
      }),
    );

    this.#dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        this.configChange.emit(config);

        // Update aria live region with tile drag info
        if (config.movedTile && this.#resourcesService) {
          let messageObservable: Observable<string>;
          if (
            this.#mediaQueryService.current === SkyMediaBreakpoints.xs ||
            this.#mediaQueryService.current === SkyMediaBreakpoints.sm
          ) {
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
    this.#subscriptions.unsubscribe();
    this.#dashboardService.destroy();
  }

  #checkReady(): void {
    if (this.#viewReady && this.config) {
      setTimeout(() => {
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
