import { Component } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
})
export class ActionButtonComponent {
  public filterActionClick(): void {
    alert('Filter action clicked');
  }

  public openActionClick(): void {
    alert('Open action clicked');
  }
}
