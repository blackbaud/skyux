import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './wait.component.fixture.html'
})
export class SkyWaitTestComponent {
  @Input()
  public isWaiting: boolean;

  @Input()
  public isFullPage: boolean;

  @Input()
  public isNonBlocking: boolean;
}
