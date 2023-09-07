import { StaticProvider } from '@angular/core';

import { SkyDataManagerColumnPickerImplService } from './data-manager-column-picker-impl.service';
import { SkyDataManagerColumnPickerService } from './data-manager-column-picker.service';

export const SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS: StaticProvider[] = [
  {
    provide: SkyDataManagerColumnPickerService,
    useValue: new SkyDataManagerColumnPickerImplService(),
  },
];
