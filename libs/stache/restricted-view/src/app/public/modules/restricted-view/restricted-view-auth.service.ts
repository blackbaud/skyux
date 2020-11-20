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

const STORAGE_KEY_HAS_BEEN_AUTHENTICATED = 'bb_has_logged_in_as_employee';

@Injectable()
export class SkyRestrictedViewAuthService {

  /**
   * Indicates if the user is an authenticated Blackbaud user.
   */
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  public get hasBeenAuthenticated(): boolean {
    try {
      return localStorage &&
        localStorage.getItem(STORAGE_KEY_HAS_BEEN_AUTHENTICATED) === '1';
    } catch (err) {
      // Local storage may not be available.
      return false;
    }
  }

  constructor(private auth: SkyAuthTokenProvider) {
    this.checkForAuth();
  }

  public clearHasBeenAuthenticated(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_HAS_BEEN_AUTHENTICATED);
    } catch (err) {
      // Local storage may not be available.
    }
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
            this.setHasBeenAuthenticated();
            this.isAuthenticated.next(true);
            return;
          }
        }
        this.isAuthenticated.next(false);
      },
      () => {
          this.isAuthenticated.next(false);
      });
  }

  private setHasBeenAuthenticated(): void {
    try {
      localStorage.setItem(STORAGE_KEY_HAS_BEEN_AUTHENTICATED, '1');
    } catch (err) {
      // Local storage may not be available.
    }
  }
}
