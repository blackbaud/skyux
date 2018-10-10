import { ListDataRequestModel } from './list-data-request.model';
import { ListDataResponseModel } from './list-data-response.model';
import { Observable } from 'rxjs/Observable';

export abstract class ListDataProvider {
  constructor(data?: Observable<Array<any>>) {}

  public abstract get(request: ListDataRequestModel): Observable<ListDataResponseModel>;

  public abstract count(): Observable<number>;
}
