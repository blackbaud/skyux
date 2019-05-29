//#region imports

import {
  Injectable
} from '@angular/core';

import * as jwtDecode from 'jwt-decode';

import {
  BBAuthGetTokenArgs
} from '@blackbaud/auth-client';

import {
  SkyAuthToken
} from '../../modules/auth-http/auth-token';

import {
  SkyAuthTokenContextArgs
} from '../../modules/auth-http/auth-token-context-args';

/**
 * Provides a mock token to downstream consumers for unit testing purposes.
 */
@Injectable()
export class SkyAuthTokenMockProvider {

  /* tslint:disable-next-line:max-line-length */
  public static readonly MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTcxZDdkMS01Y2JkLTRlNmItOGExZC1hYTZjNmY2ZjQ3M2MiLCJlbWFpbCI6IkpvaG4uRG9lQGJsYWNrYmF1ZC5jb20iLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIiwiMWJiLnNlc3Npb25faWQiOiJhUTFnUTFRRjBJcm5nSjM5Z2liaG53ZWxkZ2t3ZWdoZ2xzZGtISmJoS1lVSkN5R0szdlNJR0dYRHhoeFN0WmphZTVMbU50eUUtallQYU1vaXdYbDh5bHQxIiwiZXhwIjoxOTU4NTU1MjQyLCJpYXQiOjE5NTg1NTQ5NDIsImlzcyI6Imh0dHBzOi8vd3d3LmV4YW1wbGUuY29tLyIsImF1ZCI6ImZvbyJ9.QjrwXaOhNpi8eRJpvHo_5XE7Jqs4nY1IkNs3nOs0fGI';

  public getToken(args?: BBAuthGetTokenArgs): Promise<string> {
    return Promise.resolve(
      SkyAuthTokenMockProvider.MOCK_TOKEN
    );
  }

  public getDecodedToken(args?: BBAuthGetTokenArgs): Promise<SkyAuthToken> {
    return this.getToken(args)
      .then((token) => {
        return this.decodeToken(token);
      });
  }

  public getContextToken(args?: SkyAuthTokenContextArgs): Promise<String> {
    return this.getToken();
  }

  public getDecodedContextToken(args?: SkyAuthTokenContextArgs): Promise<SkyAuthToken> {
    return this.getDecodedToken();
  }

  public decodeToken(token: string): SkyAuthToken {
    return jwtDecode<SkyAuthToken>(token);
  }

}
