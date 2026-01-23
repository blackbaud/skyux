import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

// #region Test component
@Component({
  selector: 'sky-bar-chart-fixture',
  templateUrl: './bar-chart-harness-test.component.html',
  imports: [],
  providers: [provideNoopAnimations()],
})
export class BarChartHarnessTestComponent {}
// #endregion Test component
