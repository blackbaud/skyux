import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './style-loader';

import {
  SkyAppViewportService
} from './viewport.service';

@NgModule({
  providers: [
    SkyAppStyleLoader,
    SkyAppViewportService
  ]
})
export class SkyThemeModule { }
