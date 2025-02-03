import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-theme-status-indicator-basic-example',
  template: `
    <div class="sky-text-danger">Danger status indicator</div>
    <div class="sky-text-info">Info status indicator</div>
    <div class="sky-text-success">Success status indicator</div>
    <div class="sky-text-warning">Warning status indicator</div>
  `,
})
export class ThemeStatusIndicatorBasicExampleComponent {}
