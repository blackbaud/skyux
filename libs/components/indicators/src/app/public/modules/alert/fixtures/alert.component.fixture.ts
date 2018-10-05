import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './alert.component.fixture.html'
})
export class AlertTestComponent {
  public closeable = false;

  public closed = false;

  public alertType = 'info';
}
