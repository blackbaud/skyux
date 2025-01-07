import { Component } from '@angular/core';
import { SkyDatePipeModule } from '@skyux/datetime';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDatePipeModule],
})
export class DemoComponent {
  protected myDate = new Date('11/05/1955');
}
