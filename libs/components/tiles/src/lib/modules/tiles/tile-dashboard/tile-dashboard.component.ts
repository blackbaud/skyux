import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyTileDashboardConfig } from '../tile-dashboard-config/tile-dashboard-config';

import { SkyTileDashboardColumnComponent } from './tile-dashboard-column.component';
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
})
export class SkyTileDashboardComponent implements AfterViewInit, OnDestroy {
  /**
   * Populates the tile dashboard based on the `SkyTileDashboardConfig` object.
   * @required
   */
  @Input()
  public set config(value: SkyTileDashboardConfig) {
    if (value && !this.configSet) {
      this._config = value;
      this.configSet = true;
      this.checkReady();
    }
  }

  public get config(): SkyTileDashboardConfig {
    return this._config;
  }

  /**
   * Provides an observable to send commands to the tile dashboard. The commands should respect the
   * `SkyTileDashboardMessage` type.
   */
  @Input()
  public messageStream = new Subject<SkyTileDashboardMessage>();

  /**
   * Specifies a unique key for the UI Config Service to retrieve stored settings
   * from a database. The UI Config Service saves configuration settings for users
   * to preserve the layout and collapsed state of tile dashboards. The UI Config Service relies on `id` values from the `config` property to maintain user settings. For more information
   * about the UI Config Service, see the
   * [sticky settings documentation](https://developer.blackbaud.com/skyux/learn/get-started/sticky-settings).
   */
  @Input()
  public settingsKey: string;

  /**
   * Fires when the tile dashboard changes state and emits a SkyTileDashboardConfig
   * object. This occurs when tiles collapse or expand and when users drag and drop
   * tiles to rearrange them.
   */
  @Output()
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  @ViewChildren(SkyTileDashboardColumnComponent)
  private columns: QueryList<SkyTileDashboardColumnComponent>;

  @ViewChild('singleColumn', {
    read: SkyTileDashboardColumnComponent,
    static: false,
  })
  public singleColumn: SkyTileDashboardColumnComponent;

  public tileMovedReport: string;

  public moveInstructionsId =
    this.dashboardService.bagId + '-move-instructions';

  private _config: SkyTileDashboardConfig;

  private configSet = false;

  private ngUnsubscribe = new Subject();

  private viewReady = false;

  constructor(
    private dashboardService: SkyTileDashboardService,
    private mediaQuery: SkyMediaQueryService,
    @Optional() private resourcesService?: SkyLibResourcesService
  ) {
    this.dashboardService.configChange.subscribe(
      (config: SkyTileDashboardConfig) => {
        this.configChange.emit(config);

        // Update aria live region with tile drag info
        if (config.movedTile && this.resourcesService) {
          let messageObservable: Observable<string>;
          if (
            this.mediaQuery.current === SkyMediaBreakpoints.xs ||
            this.mediaQuery.current === SkyMediaBreakpoints.sm
          ) {
            messageObservable = this.resourcesService.getString(
              'skyux_tile_moved_assistive_text',
              config.movedTile.tileDescription,
              '1',
              '1',
              config.movedTile.position.toString(),
              config.layout.singleColumn.tiles.length.toString()
            );
          } else {
            messageObservable = this.resourcesService.getString(
              'skyux_tile_moved_assistive_text',
              config.movedTile.tileDescription,
              config.movedTile.column.toString(),
              config.layout.multiColumn.length.toString(),
              config.movedTile.position.toString(),
              config.layout.multiColumn[
                config.movedTile.column - 1
              ].tiles.length.toString()
            );
          }
          messageObservable.pipe(take(1)).subscribe((message: string) => {
            this.tileMovedReport = message;
          });
        }
      }
    );
  }

  public drop(event: CdkDragDrop<string[]>) {
    console.log('DROP:', event);
    this.dashboardService.handleDrop();
  }

  public ngAfterViewInit(): void {
    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyTileDashboardMessage) => {
        this.handleIncomingMessages(message);
      });

    this.viewReady = true;
    this.checkReady();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dashboardService.destroy();
  }

  private checkReady(): void {
    if (this.viewReady && this.config) {
      setTimeout(() => {
        this.dashboardService.init(
          this.config,
          this.columns,
          this.singleColumn,
          this.settingsKey
        );
      }, 0);
    }
  }

  private handleIncomingMessages(message: SkyTileDashboardMessage): void {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyTileDashboardMessageType.ExpandAll:
        this.dashboardService.setAllTilesCollapsed(false);
        break;

      case SkyTileDashboardMessageType.CollapseAll:
        this.dashboardService.setAllTilesCollapsed(true);
        break;
    }
  }
}
