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
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import { DataManagerLargeRoutingModule } from './data-manager-large-routing.module';
import { DataManagerLargeComponent } from './data-manager-large.component';
import { GroupInlineHelpComponent } from './inline-help/group-inline-help.component';
import { InlineHelpComponent } from './inline-help/inline-help.component';
import { LocalStorageConfigService } from './local-storage-config.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [
    DataManagerLargeComponent,
    CustomLinkComponent,
    GroupInlineHelpComponent,
    InlineHelpComponent,
  ],
  imports: [
    AgGridModule,
    CommonModule,
    DataManagerLargeRoutingModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyAgGridModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyRadioModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
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
