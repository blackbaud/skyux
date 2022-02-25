import { Injectable } from '@angular/core';

import { BBAuthClientFactory } from '@skyux/auth-client-factory';

import { SkyAuthContextArgs } from './auth-context-args';

@Injectable({
  providedIn: 'root',
})
export class SkyAuthContextProvider {
  public ensureContext(args: SkyAuthContextArgs): Promise<SkyAuthContextArgs> {
    return BBAuthClientFactory.BBContextProvider.ensureContext(args);
  }
}
