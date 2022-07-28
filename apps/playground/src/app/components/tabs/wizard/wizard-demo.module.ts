import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';
import { WizardDemoComponent } from './wizard-demo.component';
import { WizardDropdownDemoModalComponent } from './wizard-dropdown-demo-modal.component';
import { WizardRoutingModule } from './wizard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyTabsModule,
    SkyModalModule,
    ReactiveFormsModule,
    WizardRoutingModule,
  ],
  declarations: [
    WizardDemoModalComponent,
    WizardDemoComponent,
    WizardDropdownDemoModalComponent,
  ],
})
export class WizardModule {
  public static routes = WizardRoutingModule.routes;
}
