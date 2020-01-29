import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output
} from '@angular/core';

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

  public get queryParams(): {[_: string]: string} {
    if (!this.hasPermalink) {
      return;
    }

    const params: {[_: string]: string} = {};
    params[this.tabsetComponent.permalinkId] = this.permalinkValue;

    return params;
  }

  public get routerLink(): string[] {
    if (!this.hasPermalink) {
      return;
    }

    return [];
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
    @Optional() private tabsetComponent: SkyTabsetComponent
  ) { }

  public doTabClick() {
    if (!this.disabled) {
      this.tabClick.emit(undefined);
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
      this.doTabClick();
    }
  }
}
