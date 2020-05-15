import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import {
  skyAnimationSlide
} from '@skyux/animations';

import {
  SkyTileDashboardService
} from '../tile-dashboard/tile-dashboard.service';

@Component({
  selector: 'sky-tile',
  styleUrls: ['./tile.component.scss'],
  templateUrl: './tile.component.html',
  animations: [skyAnimationSlide]
})
export class SkyTileComponent {
  public isInDashboardColumn = false;

  @Input()
  public showSettings = true;

  @Input()
  public showHelp = true;

  @Output()
  public settingsClick = new EventEmitter();

  @Output()
  public isCollapsedChange = new EventEmitter<boolean>();

  @Output()
  public helpClick = new EventEmitter();

  public get isCollapsed(): boolean {
    if (this.dashboardService) {
      return this.dashboardService.tileIsCollapsed(this);
    }

    return this._isCollapsed;
  }

  @Input()
  public set isCollapsed(value: boolean) {
    if (this.dashboardService) {
      this.dashboardService.setTileCollapsed(this, value);
    } else {
      this._isCollapsed = value;
    }

    this.isCollapsedChange.emit(value);
  }

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

  private _isCollapsed = false;

  constructor(
    public elementRef: ElementRef,
    @Optional() private dashboardService: SkyTileDashboardService
  ) {
    this.isInDashboardColumn = !!dashboardService;
  }

  public settingsButtonClicked() {
    this.settingsClick.emit(undefined);
  }

  public helpButtonClicked() {
    this.helpClick.emit(undefined);
  }

  public get hasSettings(): boolean {
    return this.settingsClick.observers.length > 0 && this.showSettings;
  }

  public get hasHelp(): boolean {
    return this.helpClick.observers.length > 0 && this.showHelp;
  }

  public titleClick() {
    this.isCollapsed = !this.isCollapsed;
  }

  public chevronDirectionChange(direction: string) {
    this.isCollapsed = direction === 'down';
  }

  public moveTile(event: KeyboardEvent) {
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
