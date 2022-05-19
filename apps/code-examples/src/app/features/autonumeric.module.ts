import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutonumericDemoComponent as AutonumericCurrencyAutonumericDemoComponent } from '../code-examples/autonumeric/autonumeric/currency/autonumeric-demo.component';
import { AutonumericDemoModule as AutonumericCurrencyAutonumericDemoModule } from '../code-examples/autonumeric/autonumeric/currency/autonumeric-demo.module';
import { AutonumericDemoComponent as AutonumericInternationalFormattingAutonumericDemoComponent } from '../code-examples/autonumeric/autonumeric/international-formatting/autonumeric-demo.component';
import { AutonumericDemoModule as AutonumericInternationalFormattingAutonumericDemoModule } from '../code-examples/autonumeric/autonumeric/international-formatting/autonumeric-demo.module';
import { AutonumericDemoComponent as AutonumericOptionsProviderAutonumericDemoComponent } from '../code-examples/autonumeric/autonumeric/options-provider/autonumeric-demo.component';
import { AutonumericDemoModule as AutonumericOptionsProviderAutonumericDemoModule } from '../code-examples/autonumeric/autonumeric/options-provider/autonumeric-demo.module';
import { AutonumericDemoComponent as AutonumericPresetAutonumericDemoComponent } from '../code-examples/autonumeric/autonumeric/preset/autonumeric-demo.component';
import { AutonumericDemoModule as AutonumericPresetAutonumericDemoModule } from '../code-examples/autonumeric/autonumeric/preset/autonumeric-demo.module';

const routes: Routes = [
  {
    path: 'autonumeric/currency',
    component: AutonumericCurrencyAutonumericDemoComponent,
  },
  {
    path: 'autonumeric/international-formatting',
    component: AutonumericInternationalFormattingAutonumericDemoComponent,
  },
  {
    path: 'autonumeric/options-provider',
    component: AutonumericOptionsProviderAutonumericDemoComponent,
  },
  {
    path: 'autonumeric/preset',
    component: AutonumericPresetAutonumericDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutonumericFeatureRoutingModule {}

@NgModule({
  imports: [
    AutonumericCurrencyAutonumericDemoModule,
    AutonumericInternationalFormattingAutonumericDemoModule,
    AutonumericOptionsProviderAutonumericDemoModule,
    AutonumericPresetAutonumericDemoModule,
    AutonumericFeatureRoutingModule,
  ],
})
export class AutonumericFeatureModule {}
