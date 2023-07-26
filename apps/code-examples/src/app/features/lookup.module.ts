import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutocompleteDemoComponent as AdvancedAutocompleteComponent } from '../code-examples/lookup/autocomplete/advanced/autocomplete-demo.component';
import { AutocompleteDemoModule as AdvancedAutocompleteModule } from '../code-examples/lookup/autocomplete/advanced/autocomplete-demo.module';
import { AutocompleteDemoComponent as BasicAutocompleteComponent } from '../code-examples/lookup/autocomplete/basic/autocomplete-demo.component';
import { AutocompleteDemoModule as BasicAutocompleteModule } from '../code-examples/lookup/autocomplete/basic/autocomplete-demo.module';
import { AutocompleteDemoComponent as CustomSearchAutocompleteComponent } from '../code-examples/lookup/autocomplete/custom-search/autocomplete-demo.component';
import { AutocompleteDemoModule as CustomSearchAutocompleteModule } from '../code-examples/lookup/autocomplete/custom-search/autocomplete-demo.module';
import { AutocompleteDemoComponent as SearchFiltersAutocompleteComponent } from '../code-examples/lookup/autocomplete/search-filters/autocomplete-demo.component';
import { AutocompleteDemoModule as SearchFiltersAutocompleteModule } from '../code-examples/lookup/autocomplete/search-filters/autocomplete-demo.module';
import { CountryFieldDemoComponent } from '../code-examples/lookup/country-field/basic/country-field-demo.component';
import { CountryFieldDemoModule } from '../code-examples/lookup/country-field/basic/country-field-demo.module';
import { LookupAsyncDemoComponent as LookupAddItemDemoComponent } from '../code-examples/lookup/lookup/add-item/lookup-async-demo.component';
import { LookupAsyncDemoModule as LookupAddItemDemoModule } from '../code-examples/lookup/lookup/add-item/lookup-async-demo.module';
import { LookupAsyncDemoComponent } from '../code-examples/lookup/lookup/async/lookup-async-demo.component';
import { LookupAsyncDemoModule } from '../code-examples/lookup/lookup/async/lookup-async-demo.module';
import { LookupCustomPickerDemoComponent } from '../code-examples/lookup/lookup/custom-picker/lookup-custom-picker-demo.component';
import { LookupCustomPickerDemoModule } from '../code-examples/lookup/lookup/custom-picker/lookup-custom-picker-demo.module';
import { LookupMultipleSelectDemoComponent } from '../code-examples/lookup/lookup/multi-select/lookup-multiple-demo.component';
import { LookupMultipleSelectDemoModule } from '../code-examples/lookup/lookup/multi-select/lookup-multiple-demo.module';
import { LookupResultTemplatesDemoComponent } from '../code-examples/lookup/lookup/result-templates/lookup-result-templates-demo.component';
import { LookupResultTemplatesDemoModule } from '../code-examples/lookup/lookup/result-templates/lookup-result-templates-demo.module';
import { LookupSingleSelectDemoComponent } from '../code-examples/lookup/lookup/single-select/lookup-single-demo.component';
import { LookupSingleSelectDemoModule } from '../code-examples/lookup/lookup/single-select/lookup-single-demo.module';
import { SearchDemoComponent } from '../code-examples/lookup/search/basic/search-demo.component';
import { SearchDemoModule } from '../code-examples/lookup/search/basic/search-demo.module';
import { SelectionModalDemoComponent as SelectionModalAddItemDemoComponent } from '../code-examples/lookup/selection-modal/add-item/selection-modal-demo.component';
import { SelectionModalDemoModule as SelectionModalAddItemDemoModule } from '../code-examples/lookup/selection-modal/add-item/selection-modal-demo.module';
import { SelectionModalDemoComponent } from '../code-examples/lookup/selection-modal/basic/selection-modal-demo.component';
import { SelectionModalDemoModule } from '../code-examples/lookup/selection-modal/basic/selection-modal-demo.module';

const routes: Routes = [
  {
    path: 'autocomplete/advanced',
    component: AdvancedAutocompleteComponent,
  },
  {
    path: 'autocomplete/basic',
    component: BasicAutocompleteComponent,
  },
  {
    path: 'autocomplete/custom-search',
    component: CustomSearchAutocompleteComponent,
  },
  {
    path: 'autocomplete/search-filters',
    component: SearchFiltersAutocompleteComponent,
  },
  {
    path: 'country-field/basic',
    component: CountryFieldDemoComponent,
  },
  {
    path: 'lookup/add-item',
    component: LookupAddItemDemoComponent,
  },
  {
    path: 'lookup/async',
    component: LookupAsyncDemoComponent,
  },
  {
    path: 'lookup/custom-picker',
    component: LookupCustomPickerDemoComponent,
  },
  {
    path: 'lookup/multi-select',
    component: LookupMultipleSelectDemoComponent,
  },
  {
    path: 'lookup/result-templates',
    component: LookupResultTemplatesDemoComponent,
  },
  {
    path: 'lookup/single-select',
    component: LookupSingleSelectDemoComponent,
  },
  {
    path: 'search/basic',
    component: SearchDemoComponent,
  },
  {
    path: 'selection-modal/basic',
    component: SelectionModalDemoComponent,
  },
  {
    path: 'selection-modal/add-item',
    component: SelectionModalAddItemDemoComponent,
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
    LookupAddItemDemoModule,
    LookupAsyncDemoModule,
    LookupCustomPickerDemoModule,
    LookupMultipleSelectDemoModule,
    LookupResultTemplatesDemoModule,
    LookupSingleSelectDemoModule,
    SearchDemoModule,
    SelectionModalDemoModule,
    SelectionModalAddItemDemoModule,
    LookupRoutingModule,
  ],
})
export class LookupModule {}
