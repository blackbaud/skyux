import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-action',
  templateUrl: './action.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ActionComponent {
  public click(): void {
    alert('Action');
  }
}
