import { DragulaService, Group } from 'ng2-dragula';
import { Subject } from 'rxjs';

export class MockDragulaService extends DragulaService {
  private drag$ = new Subject<any>();
  private dragend$ = new Subject<any>();
  private drop$ = new Subject<any>();

  public add() {
    return {} as unknown as Group;
  }

  public drag = () => this.drag$;
  public dragend = () => this.dragend$;
  public drop = () => this.drop$;

  public find() {
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
