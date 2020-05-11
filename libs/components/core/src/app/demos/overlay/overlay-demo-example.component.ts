import {
  Component,
  Optional,
  Output
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  OverlayDemoExampleContext
} from './overlay-demo-example-context';

@Component({
  selector: 'app-overlay-demo-example',
  templateUrl: './overlay-demo-example.component.html',
  styleUrls: ['./overlay-demo-example.component.scss']
})
export class OverlayDemoExampleComponent {

  @Output()
  public closeClicked = new Subject<void>();

  constructor(
    @Optional() public context: OverlayDemoExampleContext
  ) { }

  public close(): void {
    this.closeClicked.next();
    this.closeClicked.complete();
  }
}
