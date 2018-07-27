import { NgModule } from '@angular/core';

import { SkyMediaQueryModule } from '../../modules';

import { SkyMediaQueryDemoComponent } from './media-query-demo.component';

@NgModule({
  declarations: [
    SkyMediaQueryDemoComponent
  ],
  imports: [
    SkyMediaQueryModule
  ],
  exports: [
    SkyMediaQueryDemoComponent
  ]
})
export class SkyMediaQueryDemoModule {}
