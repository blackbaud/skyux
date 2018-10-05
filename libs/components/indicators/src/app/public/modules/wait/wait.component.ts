import {
  Component,
  Input,
  ElementRef,
  OnInit,
  Optional
} from '@angular/core';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyWaitAdapterService
} from './wait-adapter.service';

@Component({
  selector: 'sky-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  providers: [SkyWaitAdapterService]
})
export class SkyWaitComponent implements OnInit {
  @Input()
  public ariaLabel: string;

  @Input()
  public set isWaiting(value: boolean) {
    if (value && !this._isFullPage) {
      this.adapterService.setWaitBounds(this.elRef);
    } else if (!value && !this._isFullPage) {
      this.adapterService.removeWaitBounds(this.elRef);
    }

    this.adapterService.setBusyState(
      this.elRef,
      this._isFullPage,
      value,
      this.isNonBlocking
    );

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

  public ariaLabelStream = new BehaviorSubject<string>('');

  private _isFullPage: boolean;
  private _isWaiting: boolean;

  constructor(
    private elRef: ElementRef,
    private adapterService: SkyWaitAdapterService,
    @Optional() private resourceService: SkyAppResourcesService
  ) { }

  public ngOnInit(): void {
    this.publishAriaLabel();
  }

  private publishAriaLabel(): void {
    if (this.ariaLabel) {
      this.ariaLabelStream.next(this.ariaLabel);
      return;
    }

    if (this.resourceService) {
      const type = (this.isFullPage) ? '_page' : '';
      const blocking = (this.isNonBlocking) ? '' : '_blocking';
      const key = `skyux_wait${type}${blocking}_aria_alt_text`;
      this.resourceService.getString(key).subscribe((value: string) => {
        this.ariaLabelStream.next(value);
      });
    }
  }
}
