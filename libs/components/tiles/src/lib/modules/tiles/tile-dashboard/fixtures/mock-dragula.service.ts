import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

export class MockDragulaService extends DragulaService {
  #drop$ = new Subject<any>();

  public drop = () => this.#drop$;
}
