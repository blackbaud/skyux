import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyThemeComponentClassDirective } from '../theme-component-class.directive';

@Component({
  selector: 'app-theme-component-class-test',
  templateUrl: './theme-component-class-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyThemeComponentClassTestComponent {}
