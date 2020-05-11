import {
  Location
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

import {
  SkyTabsetComponent
} from './tabset.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss']
})
export class SkyTabButtonComponent {

  @Input()
  public active: boolean;

  @Input()
  public disabled: boolean;

  @Input()
  public tabStyle: string;

  @Input()
  public set allowClose(closeAllowed: boolean) {
    this._allowClose = closeAllowed;
    this.ref.detectChanges();
    this.adapterService.detectOverflow();
  }

  public get allowClose() {
    return this._allowClose;
  }

  @Input()
  public set tabHeading(heading: string) {
    this._tabHeading = heading;
    this.ref.detectChanges();
    this.adapterService.detectOverflow();
  }

  public get tabHeading() {
    return this._tabHeading;
  }

  @Input()
  public set tabHeaderCount(count: number) {
    this._tabHeaderCount = count;
    this.ref.detectChanges();
    this.adapterService.detectOverflow();
  }

  public get tabHeaderCount() {
    return this._tabHeaderCount;
  }

  @Input()
  public permalinkValue: string;

  @Output()
  public tabClick = new EventEmitter<any>();

  @Output()
  public closeClick = new EventEmitter<any>();

  public get tabHref(): string {
    if (!this.hasPermalink) {
      /*tslint:disable-next-line:no-null-keyword*/
      return null;
    }

    const params = this.tabsetComponent.getPathParams();
    params[this.tabsetComponent.permalinkId] = this.permalinkValue;

    const baseUrl = this.location.path().split(';')[0];
    const paramString = Object.keys(params).map(k => `${k}=${params[k]}`).join(';');

    return this.location.prepareExternalUrl(`${baseUrl};${paramString}`);
  }

  private get hasPermalink(): boolean {
    return !!(
      this.tabsetComponent.permalinkId &&
      this.permalinkValue
    );
  }

  private _allowClose: boolean;

  private _tabHeading: string;

  private _tabHeaderCount: number;

  constructor(
    private adapterService: SkyTabsetAdapterService,
    private ref: ChangeDetectorRef,
    private location: Location,
    @Optional() private tabsetComponent: SkyTabsetComponent,
    @Optional() public themeSvc?: SkyThemeService
  ) { }

  public doTabClick(event: MouseEvent) {
    if (!this.disabled) {
      this.tabClick.emit(undefined);
      event.preventDefault();
    }
  }

  public doCloseClick(event: any) {
    this.closeClick.emit(undefined);

    // Prevent the click event from bubbling up to the anchor tag;
    // otherwise it will trigger a page refresh.
    event.stopPropagation();
    event.preventDefault();
  }

  public keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      this.doTabClick(event);
    }
  }
}
