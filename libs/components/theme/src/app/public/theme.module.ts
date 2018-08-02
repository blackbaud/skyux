import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './modules/style-loader';

@NgModule({
  providers: [
    SkyAppStyleLoader
  ]
})
export class SkyThemeModule { }
