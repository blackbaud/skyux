import { Injectable } from '@angular/core';

import { DragulaService, Group } from 'ng2-dragula';
import { Subject } from 'rxjs';

@Injectable()
export class MockDragulaService extends DragulaService {
  private drag$ = new Subject<any>();
  private dragend$ = new Subject<any>();
  private drop$ = new Subject<any>();

  public override add() {
    return {} as unknown as Group;
  }

  public override drag = () => this.drag$;
  public override dragend = () => this.dragend$;
  public override drop = () => this.drop$;

  public override find() {
    return {
      drake: {
        destroy() {},
        containers: [
          {
            querySelectorAll: () => {
              return [
                {
                  getAttribute: () => {
                    return 'tile-2';
                  },
                },
              ] as any[];
            },
          },
          {
            querySelectorAll: () => {
              return [
                {
                  getAttribute: () => {
                    return 'tile-1';
                  },
                },
              ] as any[];
            },
          },
        ],
      },
    } as unknown as Group;
  }
}
