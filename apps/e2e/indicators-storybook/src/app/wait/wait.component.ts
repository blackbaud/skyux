import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
})
export class WaitComponent {
  @Input()
  public showFullPageWait = false;
}
