import { Injectable } from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

@Injectable()
export class MockDragulaService extends DragulaService {
  #drop$ = new Subject<any>();

  public override drop = () => this.#drop$;
}
