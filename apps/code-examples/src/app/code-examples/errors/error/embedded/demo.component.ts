import { Component } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyErrorModule],
})
export class DemoComponent {
  public customAction(): void {
    alert('action clicked!');
  }
}
