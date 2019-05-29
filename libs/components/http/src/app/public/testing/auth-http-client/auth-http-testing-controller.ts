import {
  Injectable
} from '@angular/core';

import {
  SkyAuthTokenMockProvider
} from '../auth-http/auth-token-mock-provider';

/**
 * Provides methods for testing HTTP requests when using `SkyAuthHttpClientModule`.
 */
@Injectable()
export class SkyAuthHttpTestingController {

  /**
   * Validates whether the expected BBID Authorization header was added to the request.
   * @param request The Angular `TestRequest` object with the expected header.
   */
  public expectAuth(request: any) {
    const headers = this.getHeaders(request);

    if (
      !headers ||
      !headers.get ||
      headers.get('Authorization') !== 'Bearer ' +
        SkyAuthTokenMockProvider.MOCK_TOKEN
    ) {
      throw new Error(
        'The specified request does not contain the expected BBID Authorization header.'
      );
    }
  }

  private getHeaders(request: any): any {
    return request &&
      request.request &&
      request.request.headers;
  }

}
