import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  standalone: false,
})
export class WaitComponent {
  @Input()
  public showFullPageWait = false;
}
