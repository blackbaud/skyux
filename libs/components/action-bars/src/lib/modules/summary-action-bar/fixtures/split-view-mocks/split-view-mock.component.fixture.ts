import { Component } from '@angular/core';

@Component({
  selector: 'sky-split-view-workspace',
  template: `
    <div class="sky-split-view-workspace">
      <ng-content />
    </div>
  `,
  standalone: false,
})
export class SplitViewMockComponent {}
