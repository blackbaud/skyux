import {
  Injectable
} from '@angular/core';

@Injectable()
export class DockItemVisualContext {

  constructor(
    public readonly backgroundColor: string,
    public readonly stackOrder: number
  ) { }

}
