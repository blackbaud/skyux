import {
  StaticProvider
} from '@angular/core';

import {
  SkyDockItemConfig
} from './dock-item-config';

export interface SkyDockInsertComponentConfig extends SkyDockItemConfig {

  /**
   * Static providers to inject into the item's component.
   */
  providers?: StaticProvider[];

}
