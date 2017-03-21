import { Component } from '@angular/core';

@Component({
  selector: 'stache-container',
  template: `
    <div class="stache-container sky-container">
      <ng-content></ng-content>
    </div>
  `
})
export class StacheContainerComponent {}
