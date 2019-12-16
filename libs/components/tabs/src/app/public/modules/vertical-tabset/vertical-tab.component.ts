import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyVerticalTabsetService
} from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tab',
  templateUrl: './vertical-tab.component.html',
  styleUrls: ['./vertical-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyVerticalTabComponent implements OnInit, OnDestroy {

  @Input()
  public active: boolean = false;

  @Input()
  public get ariaControls(): string {
    return this.isMobile ? undefined : this._ariaControls;
  }
  public set ariaControls(value: string) {
    this._ariaControls = value;
  }

  @Input()
  public ariaInvalid: boolean;

  @Input()
  public ariaRequired: boolean;

  @Input()
  public get ariaRole(): string {
    if (this.isMobile) {
      return undefined;
    }
    return this._ariaRole || 'tab';
  }
  public set ariaRole(value: string) {
    this._ariaRole = value;
  }

  @Input()
  public disabled: boolean = false;

  @Input()
  public tabHeaderCount: number;

  @Input()
  public tabHeading: string;

  @Input()
  public get showTabRightArrow() {
    return this._showTabRightArrow && this.tabsetService.isMobile();
  }

  public set showTabRightArrow(value: boolean) {
    this._showTabRightArrow = value;
  }

  @Input()
  public tabId: string;

  public index: number;

  @ViewChild('tabContentWrapper')
  public tabContent: ElementRef;

  private isMobile = false;

  private _ariaControls: string;

  private _ariaRole: string;

  private _mobileSubscription = new Subject();

  private _showTabRightArrow: boolean = false;

  constructor(
    private tabsetService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.isMobile = this.tabsetService.isMobile();
    this.changeRef.markForCheck();

    this.tabsetService.switchingMobile
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeRef.markForCheck();
      });

    this.tabsetService.addTab(this);
  }

  public ngOnDestroy(): void {
    this._mobileSubscription.unsubscribe();
    this.tabsetService.destroyTab(this);
  }

  public tabIndex(): number {
    if (!this.disabled) {
      return 0;
    } else {
      return -1;
    }
  }

  public activateTab(): void {
    if (!this.disabled) {
      this.active = true;
      this.tabsetService.activateTab(this);

      this.changeRef.markForCheck();
    }
  }

  public tabDeactivated(): void {
    this.changeRef.markForCheck();
  }
}
