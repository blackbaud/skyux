import {
  Injectable
} from '@angular/core';

import {
  BBAuth,
  BBAuthGetTokenArgs
} from '@blackbaud/auth-client';

@Injectable()
export class SkyAuthTokenProvider {
  public getToken(args?: BBAuthGetTokenArgs): Promise<string> {
    return BBAuth.getToken(args);
  }
}
