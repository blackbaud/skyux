import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewChild
} from '@angular/core';

import {
  skyAnimationSlide
} from '@skyux/animations';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyTileDashboardService
} from '../tile-dashboard/tile-dashboard.service';

/**
 * Provides a common look-and-feel for tab content.
 */
@Component({
  selector: 'sky-tile',
  styleUrls: ['./tile.component.scss'],
  templateUrl: './tile.component.html',
  animations: [skyAnimationSlide]
})
export class SkyTileComponent implements OnDestroy {

  /**
   * Indicates whether to display a settings button in the tile header. To display the
   * button, you must also listen for the `settingsClick` event.
   * @default true
   */
  @Input()
  public showSettings = true;

  /**
   * Indicates whether to display a help button in the tile header. To display the
   * button, you must also listen for the `helpClick` event.
   * @default true
   */
  @Input()
  public showHelp = true;

  /**
   * Fires when users select the settings button in the tile header. The settings
   * button only appears when the `showSettings` property is set to `true`.
   */
  @Output()
  public settingsClick = new EventEmitter();

  /**
   * Fires when the tile's collapsed state changes. Returns `true` when the tile
   * collapses and `false` when it expands.
   */
  @Output()
  public isCollapsedChange = new EventEmitter<boolean>();

  /**
   * Fires when users select the help button in the tile header. The help
   * button only appears when the `showHelp` property is set to `true`.
   */
  @Output()
  public helpClick = new EventEmitter();

  public get isCollapsed(): boolean {
    if (this.dashboardService) {
      const configCollapsedState = this.dashboardService.tileIsCollapsed(this);
      this._isCollapsed = configCollapsedState;
    }

    return this._isCollapsed;
  }

  /**
   * Indicates whether the tile is in a collapsed state.
   * @default false
   */
  @Input()
  public set isCollapsed(value: boolean) {
    if (this.dashboardService) {
      this.dashboardService.setTileCollapsed(this, value);
    }

    this._isCollapsed = value;

    this.isCollapsedChange.emit(value);
  }

  public isInDashboardColumn = false;

  @ViewChild('grabHandle', {
    read: ElementRef,
    static: false
  })
  private grabHandle: ElementRef;

  @ViewChild('titleContainer', {
    read: ElementRef,
    static: false
  })
  private title: ElementRef;

  private ngUnsubscribe = new Subject();

  private _isCollapsed = false;

  constructor(
    public elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    @Optional() private dashboardService: SkyTileDashboardService
  ) {
    this.isInDashboardColumn = !!dashboardService;

    if (this.dashboardService) {
      /**
       * This subscription ensures that if any values which come in from the dashboard service are
       * updated that the component will update if the tile's parent component utilizes OnPush
       * change detection.
       */
      this.dashboardService.configChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.changeDetector.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public settingsButtonClicked(): void {
    this.settingsClick.emit(undefined);
  }

  public helpButtonClicked(): void {
    this.helpClick.emit(undefined);
  }

  public get hasSettings(): boolean {
    return this.settingsClick.observers.length > 0 && this.showSettings;
  }

  public get hasHelp(): boolean {
    return this.helpClick.observers.length > 0 && this.showHelp;
  }

  public titleClick(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public chevronDirectionChange(direction: string): void {
    this.isCollapsed = direction === 'down';
  }

  public moveTile(event: KeyboardEvent): void {
    if (this.isInDashboardColumn) {
      let direction = event.key.toLowerCase().replace('arrow', '');
      if (direction === 'up'
        || direction === 'down'
        || direction === 'left'
        || direction === 'right'
      ) {
        this.dashboardService.moveTileOnKeyDown(
          this,
          direction,
          this.title ? this.title.nativeElement.innerText : undefined
        );
        this.focusHandle();
      }
    }
  }

  private focusHandle(): void {
    this.grabHandle.nativeElement.focus();
  }
}
