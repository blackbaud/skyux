import { Injectable } from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

@Injectable()
export class MockDragulaService extends DragulaService {
  #drag$ = new Subject<any>();
  #dragend$ = new Subject<any>();
  #drop$ = new Subject<any>();

  public override drag = () => this.#drag$;
  public override dragend = () => this.#dragend$;
  public override drop = () => this.#drop$;
}
