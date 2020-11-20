import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  skip,
  takeUntil
} from 'rxjs/operators';

import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

@Component({
  selector: 'sky-restricted-content-alert',
  templateUrl: './restricted-content-alert.component.html',
  styleUrls: ['./restricted-content-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyRestrictedContentAlertComponent implements OnInit, OnDestroy {

  public showAlert: boolean;

  public get alertClosed(): boolean {
    return this._alertClosed;
  }

  public set alertClosed(value: boolean) {
    this._alertClosed = value;

    /* istanbul ignore else */
    if (value) {
      this.svc.clearHasBeenAuthenticated();
    }
  }

  public signInUrl: string;

  private ngUnsubscribe = new Subject<any>();

  private _alertClosed: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private svc: SkyRestrictedViewAuthService
  ) { }

  public ngOnInit(): void {
    this.signInUrl = 'https://signin.blackbaud.com?redirectUrl=' +
      encodeURIComponent(location.href);

    // NOTE: We skip the first response here to ensure nothing is shown until the token request is complete.
    this.svc.isAuthenticated
      .pipe(
        skip(1),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((isAuthenticated) => {
        this.showAlert = !isAuthenticated && this.svc.hasBeenAuthenticated;
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
