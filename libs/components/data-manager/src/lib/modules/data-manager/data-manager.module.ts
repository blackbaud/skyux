import { NgModule } from '@angular/core';

import { SkyDataManagerColumnPickerImplService } from './data-manager-column-picker/data-manager-column-picker-impl.service';
import { SkyDataManagerColumnPickerService } from './data-manager-column-picker/data-manager-column-picker.service';
import { SkyDataManagerToolbarLeftItemComponent } from './data-manager-toolbar/data-manager-toolbar-left-item.component';
import { SkyDataManagerToolbarPrimaryItemComponent } from './data-manager-toolbar/data-manager-toolbar-primary-item.component';
import { SkyDataManagerToolbarRightItemComponent } from './data-manager-toolbar/data-manager-toolbar-right-item.component';
import { SkyDataManagerToolbarSectionComponent } from './data-manager-toolbar/data-manager-toolbar-section.component';
import { SkyDataManagerToolbarComponent } from './data-manager-toolbar/data-manager-toolbar.component';
import { SkyDataManagerComponent } from './data-manager.component';
import { SkyDataViewComponent } from './data-view.component';

@NgModule({
  imports: [
    SkyDataManagerComponent,
    SkyDataManagerToolbarComponent,
    SkyDataManagerToolbarLeftItemComponent,
    SkyDataManagerToolbarPrimaryItemComponent,
    SkyDataManagerToolbarRightItemComponent,
    SkyDataManagerToolbarSectionComponent,
    SkyDataViewComponent,
  ],
  exports: [
    SkyDataManagerComponent,
    SkyDataManagerToolbarComponent,
    SkyDataManagerToolbarLeftItemComponent,
    SkyDataManagerToolbarPrimaryItemComponent,
    SkyDataManagerToolbarRightItemComponent,
    SkyDataManagerToolbarSectionComponent,
    SkyDataViewComponent,
  ],
  providers: [
    {
      provide: SkyDataManagerColumnPickerService,
      useClass: SkyDataManagerColumnPickerImplService,
    },
  ],
})
export class SkyDataManagerModule {}
