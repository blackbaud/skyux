import { Observable } from 'rxjs';

import { ListDataRequestModel } from './list-data-request.model';
import { ListDataResponseModel } from './list-data-response.model';

/**
 * @internal
 */
export abstract class ListDataProvider {
  public abstract get(
    request: ListDataRequestModel
  ): Observable<ListDataResponseModel>;

  public abstract count(): Observable<number>;
}
