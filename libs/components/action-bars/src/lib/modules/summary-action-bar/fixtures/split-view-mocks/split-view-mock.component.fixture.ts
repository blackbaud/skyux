import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-split-view-workspace',
  template: `
    <div class="sky-split-view-workspace">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SplitViewMockComponent {}
