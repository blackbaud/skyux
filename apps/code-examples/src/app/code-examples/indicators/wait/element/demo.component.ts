import { Component } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyWaitModule],
})
export class DemoComponent {
  protected isWaiting = false;
}
