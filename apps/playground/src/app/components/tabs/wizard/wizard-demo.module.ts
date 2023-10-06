import { NgModule } from '@angular/core';

import { WizardDemoComponent } from './wizard-demo.component';
import { WizardRoutingModule } from './wizard-routing.module';

@NgModule({
  imports: [WizardRoutingModule],
  declarations: [WizardDemoComponent],
})
export class WizardModule {
  public static routes = WizardRoutingModule.routes;
}
