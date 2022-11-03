import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO: Select field story

// import { SelectFieldDemoComponent } from '../code-examples/select-field/select-field/basic/select-field-demo.component';
// import { SelectFieldDemoComponent as SelectFieldCustomComponent } from '../code-examples/select-field/select-field/basic/select-field-demo.component';
// import { SelectFieldDemoModule } from '../code-examples/select-field/select-field/basic/select-field-demo.module';
// import { SelectFieldDemoModule as SelectFieldCustomModule } from '../code-examples/select-field/select-field/basic/select-field-demo.module';

const routes: Routes = [
  // {
  //   path: 'basic',
  //   component: SelectFieldDemoComponent,
  // },
  // {
  //   path: 'custom',
  //   component: SelectFieldCustomComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectFieldFeatureRoutingModule {}

@NgModule({
  imports: [
    SelectFieldFeatureRoutingModule,
    // SelectFieldDemoModule,
    // SelectFieldCustomModule,
  ],
})
export class SelectFieldFeatureModule {}
