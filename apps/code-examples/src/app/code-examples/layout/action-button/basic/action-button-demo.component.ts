import { Component } from '@angular/core';

@Component({
  selector: 'app-action-button-demo',
  templateUrl: './action-button-demo.component.html',
})
export class ActionButtonDemoComponent {
  public filterActionClick(): void {
    alert('Filter action clicked');
  }

  public openActionClick(): void {
    alert('Open action clicked');
  }
}
