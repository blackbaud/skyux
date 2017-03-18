import { Component } from '@angular/core';

@Component({
  selector: 'stache-row',
  template: `
    <div class="stache-row">
      <ng-content></ng-content>
    </div>
  `
})
export class StacheRowComponent {}
