import { Component } from '@angular/core';

import { SkyThemeComponentClassDirective } from '../theme-component-class.directive';

@Component({
  selector: 'app-theme-component-class-test',
  templateUrl: './theme-component-class-test.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyThemeComponentClassTestComponent {}
