import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './style-loader';

import {
  SkyAppViewportService
} from './viewport.service';

import {
  SkyThemeDirective
} from './theming/theme.directive';

@NgModule({
  declarations: [
    SkyThemeDirective
  ],
  providers: [
    SkyAppStyleLoader,
    SkyAppViewportService
  ],
  exports: [
    SkyThemeDirective
  ]
})
export class SkyThemeModule { }
