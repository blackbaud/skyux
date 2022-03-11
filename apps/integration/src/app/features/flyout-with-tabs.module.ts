import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { FlyoutWithTabsModule } from '../integrations/flyout-with-tabs/flyout-with-tabs.module';
import { CountryFieldDemoComponent } from '../code-examples/lookup/country-field/basic/country-field-demo.component';

import { FlyoutWithTabsComponent } from '../integrations/flyout-with-tabs/flyout-demo.component';

const routes: Routes = [
  {
    path: 'flyout-with-tabs',
    component: FlyoutWithTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LookupRoutingModule {}

@NgModule({
  imports: [
    AdvancedAutocompleteModule,
    BasicAutocompleteModule,
    CustomSearchAutocompleteModule,
    SearchFiltersAutocompleteModule,
    CountryFieldDemoModule,
    LookupAsyncDemoModule,
    LookupCustomPickerDemoModule,
    LookupMultipleSelectDemoModule,
    LookupResultTemplatesDemoModule,
    LookupSingleSelectDemoModule,
    SearchDemoModule,
    LookupRoutingModule,
  ],
})
export class FlyoutWithTabsModule {}
