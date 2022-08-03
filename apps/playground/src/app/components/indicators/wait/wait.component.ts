import { Component } from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
})
export class WaitComponent {
  public isWaiting: boolean;
  public isFullPageWaiting: boolean;
  public isNonBlocking: boolean;
}
