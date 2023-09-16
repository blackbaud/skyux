import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-flyout',
  template: `
    <div class="sky-padding-even-xl">
      <h2>Sample flyout</h2>
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
export class FlyoutComponent {}
