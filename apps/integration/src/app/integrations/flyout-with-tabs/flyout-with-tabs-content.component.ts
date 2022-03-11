import { Component } from '@angular/core';

@Component({
  selector: 'app-flyout-demo-flyout',
  template: `
    <div class="sky-padding-even-large">
      <h2 id="flyout-title">Sample flyout</h2>
      <p>
        Flyouts can display large quantities of supplementary information
        related to a task, including:
      </p>
      <ul>
        <li>lists</li>
        <li>records</li>
        <li>analytics</li>
      </ul>
    </div>
  `,
})
export class FlyoutWithTabsContentComponent {}
