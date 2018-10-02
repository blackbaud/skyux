import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  Optional
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import 'rxjs/operator/take';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@skyux/core';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  SkyTileDashboardColumnComponent
} from '../tile-dashboard-column';
import {
  SkyTileDashboardConfig
} from '../tile-dashboard-config';
import {
  SkyTileDashboardService
} from './tile-dashboard.service';

@Component({
  selector: 'sky-tile-dashboard',
  styleUrls: ['./tile-dashboard.component.scss'],
  templateUrl: './tile-dashboard.component.html',
  providers: [SkyTileDashboardService]
})
export class SkyTileDashboardComponent implements AfterViewInit, OnDestroy {
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

  @Output()
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  @ViewChildren(SkyTileDashboardColumnComponent)
  public columns: QueryList<SkyTileDashboardColumnComponent>;

  @ViewChild('singleColumn', { read: SkyTileDashboardColumnComponent })
  public singleColumn: SkyTileDashboardColumnComponent;

  public tileMovedReport: string;

  private _config: SkyTileDashboardConfig;

  private configSet = false;

  private viewReady = false;

  constructor(
    // HACK: This is public so it can be accessed via a unit test due to breaking changes
    // in RC5. https://github.com/angular/angular/issues/10854
    public dashboardService: SkyTileDashboardService,
    private mediaQuery: SkyMediaQueryService,
    @Optional() private resourcesService?: SkyAppResourcesService
  ) {
    dashboardService.configChange.subscribe((config: SkyTileDashboardConfig) => {
      this.configChange.emit(config);

      // Update aria live region with tile drag info
      if (config.movedTile && this.resourcesService) {
        let messageObservable: Observable<string>;
        if (
          this.mediaQuery.current === SkyMediaBreakpoints.xs ||
          this.mediaQuery.current === SkyMediaBreakpoints.sm
        ) {
          messageObservable = this.resourcesService.getString('skyux_tile_moved_assistive_text',
            config.movedTile.tileDescription,
            '1',
            '1',
            config.movedTile.position.toString(),
            config.layout.singleColumn.tiles.length.toString());
        } else {
          messageObservable = this.resourcesService.getString('skyux_tile_moved_assistive_text',
            config.movedTile.tileDescription,
            config.movedTile.column.toString(),
            config.layout.multiColumn.length.toString(),
            config.movedTile.position.toString(),
            config.layout.multiColumn[config.movedTile.column - 1].tiles.length.toString());
        }
        messageObservable
          .take(1)
          .subscribe((message: string) => {
            this.tileMovedReport = message;
          });
      }
    });
  }

  public ngAfterViewInit() {
    this.viewReady = true;
    this.checkReady();
  }

  public ngOnDestroy() {
    this.dashboardService.destroy();
  }

  private checkReady() {
    if (this.viewReady && this.config) {
      setTimeout(() => {
        this.dashboardService.init(this.config, this.columns, this.singleColumn);
      }, 0);
    }
  }
}
