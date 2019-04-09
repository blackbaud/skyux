import { Injectable } from '@angular/core';
import { BBAuthGetTokenArgs } from '@blackbaud/auth-client';
import { BehaviorSubject } from 'rxjs';
import { SkyAuthTokenProvider } from '@blackbaud/skyux-builder/runtime';

@Injectable()
export class StacheAuthService  {

  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private auth: SkyAuthTokenProvider) {
    this.checkForAuth();
  }

  private checkForAuth() {
    const args: BBAuthGetTokenArgs = {
      disableRedirect: true
    };

    this.auth.getToken(args)
      .then(() => {
        this.isAuthenticated.next(true);
      },
      () => {});
  }
}
