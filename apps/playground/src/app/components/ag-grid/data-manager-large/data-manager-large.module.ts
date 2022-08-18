import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';

import { AgGridModule } from 'ag-grid-angular';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import { DataManagerLargeRoutingModule } from './data-manager-large-routing.module';
import { DataManagerLargeComponent } from './data-manager-large.component';
import { LocalStorageConfigService } from './local-storage-config.service';

@NgModule({
  declarations: [DataManagerLargeComponent, CustomLinkComponent],
  imports: [
    AgGridModule,
    CommonModule,
    DataManagerLargeRoutingModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyRadioModule,
    ReactiveFormsModule,
  ],
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
})
export class DataManagerLargeModule {
  public static routes = DataManagerLargeRoutingModule.routes;
}
