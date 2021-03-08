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
  SkyThemeClassDirective
} from './theming/theme-class.directive';

import {
  SkyThemeDirective
} from './theming/theme.directive';

import {
  SkyThemeIfDirective
} from './theming/theme-if.directive';

@NgModule({
  declarations: [
    SkyThemeClassDirective,
    SkyThemeDirective,
    SkyThemeIfDirective
  ],
  providers: [
    SkyAppStyleLoader,
    SkyAppViewportService
  ],
  exports: [
    SkyThemeClassDirective,
    SkyThemeDirective,
    SkyThemeIfDirective
  ]
})
export class SkyThemeModule { }
