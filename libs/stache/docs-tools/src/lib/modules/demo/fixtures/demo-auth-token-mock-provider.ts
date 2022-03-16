import { SkyAuthToken } from '@skyux/http';

export class DemoAuthTokenMockProvider {
  public testToken?: SkyAuthToken = {
    '1bb.perms': [],
  };

  public getDecodedToken(): Promise<SkyAuthToken> {
    return Promise.resolve(this.testToken);
  }
}
