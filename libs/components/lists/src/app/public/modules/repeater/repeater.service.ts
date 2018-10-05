import { EventEmitter, Injectable } from '@angular/core';

import { SkyRepeaterItemComponent } from './repeater-item.component';

@Injectable()
export class SkyRepeaterService {
  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent) {
    this.itemCollapseStateChange.emit(item);
  }
}
