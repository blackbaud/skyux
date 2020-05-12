import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyWaitAdapterService
} from './wait-adapter.service';

let nextId = 0;

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
      this.isFullPage,
      value,
      this.isNonBlocking,
      this.id
    );

    this._isWaiting = value;
  }

  public get isWaiting(): boolean {
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

  public get isFullPage(): boolean {
    return this._isFullPage;
  }

  @Input()
  public isNonBlocking: boolean;

  public ariaLabelStream = new BehaviorSubject<string>('');

  private id = `sky-wait-${++nextId}`;
  private _isFullPage: boolean;
  private _isWaiting: boolean;

  constructor(
    private elRef: ElementRef,
    private adapterService: SkyWaitAdapterService,
    @Optional() private resourceService: SkyLibResourcesService
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
