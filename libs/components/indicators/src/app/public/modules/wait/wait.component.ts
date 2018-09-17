import {
  Component,
  Input,
  ElementRef
} from '@angular/core';

import {
  SkyWaitAdapterService
} from './wait-adapter.service';

@Component({
  selector: 'sky-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  providers: [SkyWaitAdapterService]
})
export class SkyWaitComponent {

  @Input()
  public set isWaiting(value: boolean) {
    if (value && !this._isFullPage) {
      this.adapterService.setWaitBounds(this.elRef);
    } else if (!value && !this._isFullPage) {
      this.adapterService.removeWaitBounds(this.elRef);
    }
    this.adapterService.setBusyState(this.elRef, this._isFullPage, value);
    this._isWaiting = value;
  }

  public get isWaiting() {
    return this._isWaiting;
  }

  @Input()
  public set isFullPage(value: boolean) {
    if (value) {
      this.adapterService.removeWaitBounds(this.elRef);
    } else if (!value && this._isWaiting) {
      this.adapterService.setWaitBounds(this.elRef);
    }

    this._isFullPage = value;
  }

  public get isFullPage() {
    return this._isFullPage;
  }

  @Input()
  public isNonBlocking: boolean;

  private _isWaiting: boolean;

  private _isFullPage: boolean;

  constructor(private elRef: ElementRef, private adapterService: SkyWaitAdapterService) { }
}
