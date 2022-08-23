import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IdDemoComponent as IdIdDemoComponent } from '../code-examples/core/id/id-demo.component';
import { IdDemoModule as IdIdDemoModule } from '../code-examples/core/id/id-demo.module';
import { MediaQueryDemoComponent as MediaQueryBasicMediaQueryDemoComponent } from '../code-examples/core/media-query/basic/media-query-demo.component';
import { MediaQueryDemoModule as MediaQueryBasicMediaQueryDemoModule } from '../code-examples/core/media-query/basic/media-query-demo.module';
import { NumericDemoComponent as NumericBasicNumericDemoComponent } from '../code-examples/core/numeric/basic/numeric-demo.component';
import { NumericDemoModule as NumericBasicNumericDemoModule } from '../code-examples/core/numeric/basic/numeric-demo.module';

const routes: Routes = [
  { path: 'id', component: IdIdDemoComponent },
  {
    path: 'media-query/basic',
    component: MediaQueryBasicMediaQueryDemoComponent,
  },
  { path: 'numeric/basic', component: NumericBasicNumericDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreFeatureRoutingModule {}

@NgModule({
  imports: [
    IdIdDemoModule,
    MediaQueryBasicMediaQueryDemoModule,
    NumericBasicNumericDemoModule,
    CoreFeatureRoutingModule,
  ],
})
export class CoreFeatureModule {}
