import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

export class MockDragulaService extends DragulaService {
  #drag$ = new Subject<any>();
  #dragend$ = new Subject<any>();
  #drop$ = new Subject<any>();

  public drag = () => this.#drag$;
  public dragend = () => this.#dragend$;
  public drop = () => this.#drop$;
}
