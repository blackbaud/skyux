import { Injectable } from '@angular/core';

import { SkyDataManagerColumnPickerComponent } from './data-manager-column-picker.component';

@Injectable()
export class SkyDataManagerColumnPickerImplService {
  public getComponentType(): typeof SkyDataManagerColumnPickerComponent {
    return SkyDataManagerColumnPickerComponent;
  }
}
