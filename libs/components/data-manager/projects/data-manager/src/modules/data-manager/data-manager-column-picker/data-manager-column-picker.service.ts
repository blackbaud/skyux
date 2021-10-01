import {
  Injectable
} from '@angular/core';

import type {
  SkyDataManagerColumnPickerComponent
} from './data-manager-column-picker.component';

/**
 * Service that provides the column picker component type so it can be dynamically
 * created in the toolbar component. This avoids a circular reference between column
 * picker and toolbar.
 * https://angular.io/errors/NG3003
 */
@Injectable()
export abstract class SkyDataManagerColumnPickerService {
  public abstract getComponentType(): typeof SkyDataManagerColumnPickerComponent;
}
