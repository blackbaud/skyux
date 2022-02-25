import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { SkyViewkeeperModule } from '@skyux/core';

import { SkyIconModule } from '@skyux/indicators';

import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';

import { SkyBackToTopModule, SkyToolbarModule } from '@skyux/layout';

import {
  SkyFilterModule,
  SkyRepeaterModule,
  SkySortModule,
} from '@skyux/lists';

import { SkySearchModule } from '@skyux/lookup';

import { SkyModalModule } from '@skyux/modals';

import { SkyDataManagerResourcesModule } from '../shared/sky-data-manager-resources.module';

import { SkyDataManagerColumnPickerComponent } from './data-manager-column-picker/data-manager-column-picker.component';

import { SkyDataManagerComponent } from './data-manager.component';

import { SkyDataManagerToolbarLeftItemComponent } from './data-manager-toolbar/data-manager-toolbar-left-item.component';

import { SkyDataManagerToolbarPrimaryItemComponent } from './data-manager-toolbar/data-manager-toolbar-primary-item.component';

import { SkyDataManagerToolbarRightItemComponent } from './data-manager-toolbar/data-manager-toolbar-right-item.component';

import { SkyDataManagerToolbarSectionComponent } from './data-manager-toolbar/data-manager-toolbar-section.component';

import { SkyDataManagerToolbarComponent } from './data-manager-toolbar/data-manager-toolbar.component';

import { SkyDataViewComponent } from './data-view.component';

import { SkyDataManagerColumnPickerService } from './data-manager-column-picker/data-manager-column-picker.service';

import { SkyDataManagerColumnPickerImplService } from './data-manager-column-picker/data-manager-column-picker-impl.service';

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
  entryComponents: [SkyDataManagerColumnPickerComponent],
  providers: [
    {
      provide: SkyDataManagerColumnPickerService,
      useClass: SkyDataManagerColumnPickerImplService,
    },
  ],
})
export class SkyDataManagerModule {}
