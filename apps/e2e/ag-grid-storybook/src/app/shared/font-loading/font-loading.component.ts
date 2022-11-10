import { Component } from '@angular/core';

/**
 * Trigger font loading at several weights for Cypress visual regression tests.
 */
@Component({
  selector: 'app-font-loading',
  templateUrl: './font-loading.component.html',
  styleUrls: ['./font-loading.component.scss'],
})
export class FontLoadingComponent {
  public fontWeights = ['lite', 'normal', 'bold'];
  public fontFamilies = ['sans', 'sans-condensed'];
}
