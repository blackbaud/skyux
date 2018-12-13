import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-wait-demo',
  templateUrl: './wait-demo.component.html',
  styleUrls: ['./wait-demo.component.scss']
})
export class SkyWaitDemoComponent {
  public isWaiting: boolean;
  public isFullPageWaiting: boolean;
  public isNonBlocking: boolean;
}
