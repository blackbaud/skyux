import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

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

  @Output()
  public tabClick = new EventEmitter<any>();

  @Output()
  public closeClick = new EventEmitter<any>();

  private _allowClose: boolean;

  private _tabHeading: string;

  private _tabHeaderCount: number;

  constructor(
    private adapterService: SkyTabsetAdapterService,
    private ref: ChangeDetectorRef
  ) {}

  public doTabClick() {
    if (!this.disabled) {
      this.tabClick.emit(undefined);
    }
  }

  public doCloseClick() {
    this.closeClick.emit(undefined);
  }

  public keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      this.doTabClick();
    }
  }
}
