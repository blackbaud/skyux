import {
  Injectable
} from '@angular/core';

import {
  BBAuthGetTokenArgs
} from '@blackbaud/auth-client';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyAuthTokenProvider
} from '@skyux/http';

@Injectable()
export class SkyRestrictedViewAuthService  {

  /**
   * Indicates if the user is an authenticated Blackbaud user.
   */
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private auth: SkyAuthTokenProvider) {
    this.checkForAuth();
  }

  private checkForAuth() {
    const args: BBAuthGetTokenArgs = {
      disableRedirect: true
    };

    this.auth
      .getDecodedToken(args)
      .then((token) => {
        let permissions = token['1bb.perms'];
        if (permissions) {
          if (typeof permissions === 'number') {
            permissions = [permissions];
          }
          if (permissions.indexOf(1) > -1) {
            this.isAuthenticated.next(true);
          }
        }
      },
      () => {});
  }
}
