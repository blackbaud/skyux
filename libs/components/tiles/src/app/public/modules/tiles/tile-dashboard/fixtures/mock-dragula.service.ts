import { DragulaService } from 'ng2-dragula/ng2-dragula';

export class MockDragulaService extends DragulaService {
  public add() { }

  public setOptions() { }

  public find() {
    return {
      drake: {
        containers: [
          {
            querySelectorAll: () => {
              return [
                {
                  getAttribute: () => {
                    return 'tile-2';
                  }
                }
              ] as any[];
            }
          },
          {
            querySelectorAll: () => {
              return [
                {
                  getAttribute: () => {
                    return 'tile-1';
                  }
                }
              ] as any[];
            }
          }
        ]
      }
    };
  }
}
