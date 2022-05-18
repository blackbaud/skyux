import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorDemoComponent as ErrorEmbeddedDemoComponent } from '../code-examples/errors/error/embedded/error-demo.component';
import { ErrorDemoModule as ErrorEmbeddedDemoModule } from '../code-examples/errors/error/embedded/error-demo.module';
import { ErrorDemoComponent as ErrorModalDemoComponent } from '../code-examples/errors/error/modal/error-demo.component';
import { ErrorDemoModule as ErrorModalDemoModule } from '../code-examples/errors/error/modal/error-demo.module';

const routes: Routes = [
  {
    path: 'embedded',
    component: ErrorEmbeddedDemoComponent,
  },
  {
    path: 'modal',
    component: ErrorModalDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsFeatureRoutingModule {}

@NgModule({
  imports: [
    ErrorsFeatureRoutingModule,
    ErrorEmbeddedDemoModule,
    ErrorModalDemoModule,
  ],
})
export class ErrorsFeatureModule {}
