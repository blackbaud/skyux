import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-flyout-docs-flyout',
  template: `
    <div
      class="sky-padding-even-large"
    >
      <h2>
        Sample flyout
      </h2>
      <p>
        Flyouts can display large quantities of supplementary information related to a task, including:
      </p>
        <ul>
          <li>lists</li>
          <li>records</li>
          <li>analytics</li>
        </ul>
    </div>
  `
})
export class FlyoutDocsFlyoutComponent {}
