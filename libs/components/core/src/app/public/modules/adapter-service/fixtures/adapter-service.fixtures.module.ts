import {
  NgModule
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '../adapter.service';

import {
  AdapterServiceFixtureComponent
} from './adapter-service.fixture';

@NgModule({
  declarations: [
    AdapterServiceFixtureComponent
  ],
  imports: [],
  providers: [
    SkyCoreAdapterService
  ],
  exports: [
    AdapterServiceFixtureComponent
  ]
})
export class SkyAdapterServiceFixturesModule { }
