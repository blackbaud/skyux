import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyBackToTopModule, SkyToolbarModule } from '@skyux/layout';
import {
  SkyFilterModule,
  SkyRepeaterModule,
  SkySortModule,
} from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { SkyDataManagerResourcesModule } from '../shared/sky-data-manager-resources.module';

import { SkyDataManagerColumnPickerImplService } from './data-manager-column-picker/data-manager-column-picker-impl.service';
import { SkyDataManagerColumnPickerComponent } from './data-manager-column-picker/data-manager-column-picker.component';
import { SkyDataManagerColumnPickerService } from './data-manager-column-picker/data-manager-column-picker.service';
import { SkyDataManagerToolbarLeftItemComponent } from './data-manager-toolbar/data-manager-toolbar-left-item.component';
import { SkyDataManagerToolbarPrimaryItemComponent } from './data-manager-toolbar/data-manager-toolbar-primary-item.component';
import { SkyDataManagerToolbarRightItemComponent } from './data-manager-toolbar/data-manager-toolbar-right-item.component';
import { SkyDataManagerToolbarSectionComponent } from './data-manager-toolbar/data-manager-toolbar-section.component';
import { SkyDataManagerToolbarComponent } from './data-manager-toolbar/data-manager-toolbar.component';
import { SkyDataManagerComponent } from './data-manager.component';
import { SkyDataViewComponent } from './data-view.component';

@NgModule({
  declarations: [
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerComponent,
    SkyDataManagerToolbarLeftItemComponent,
    SkyDataManagerToolbarPrimaryItemComponent,
    SkyDataManagerToolbarRightItemComponent,
    SkyDataManagerToolbarSectionComponent,
    SkyDataManagerToolbarComponent,
    SkyDataViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyBackToTopModule,
    SkyCheckboxModule,
    SkyDataManagerResourcesModule,
    SkyFilterModule,
    SkyIconModule,
    SkyModalModule,
    SkyRadioModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkySortModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
  ],
  exports: [
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerComponent,
    SkyDataManagerToolbarLeftItemComponent,
    SkyDataManagerToolbarPrimaryItemComponent,
    SkyDataManagerToolbarRightItemComponent,
    SkyDataManagerToolbarSectionComponent,
    SkyDataManagerToolbarComponent,
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
