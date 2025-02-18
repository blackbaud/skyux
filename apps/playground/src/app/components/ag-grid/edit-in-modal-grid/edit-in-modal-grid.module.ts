import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';
import { EditInModalGridRoutingModule } from './edit-in-modal-grid-routing.module';

ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [SkyAgGridDemoComponent],
  imports: [
    AgGridModule,
    CommonModule,
    EditInModalGridRoutingModule,
    SkyAgGridModule,
    SkySearchModule,
    SkyToolbarModule,
  ],
})
export class EditInModalGridModule {
  public static routes = EditInModalGridRoutingModule.routes;
}
