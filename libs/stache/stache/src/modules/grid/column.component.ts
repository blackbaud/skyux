import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-column',
  template: `
    <div class="stache-column">
      <ng-content></ng-content>
    </div>
  `
})
export class StacheColumnComponent {
  @Input()
  public screenSmall: number = 12;
}
