import { Component } from '@angular/core';

@Component({
  selector: 'sky-split-view-workspace',
  template: `
    <div class="sky-split-view-workspace">
      <ng-content></ng-content>
    </div>
  `,
})
export class SplitViewMockComponent {}
