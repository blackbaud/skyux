import { NgModule } from '@angular/core';

import { SkyThemeClassDirective } from './theming/theme-class.directive';
import { SkyThemeIfDirective } from './theming/theme-if.directive';
import { SkyThemeDirective } from './theming/theme.directive';

@NgModule({
  declarations: [
    SkyThemeClassDirective,
    SkyThemeDirective,
    SkyThemeIfDirective,
  ],
  exports: [SkyThemeClassDirective, SkyThemeDirective, SkyThemeIfDirective],
})
export class SkyThemeModule {}
