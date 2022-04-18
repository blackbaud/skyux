import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

export class MockDragulaService extends DragulaService {
  private drag$ = new Subject<any>();
  private dragend$ = new Subject<any>();
  private drop$ = new Subject<any>();

  public drag = () => this.drag$;
  public dragend = () => this.dragend$;
  public drop = () => this.drop$;
}
