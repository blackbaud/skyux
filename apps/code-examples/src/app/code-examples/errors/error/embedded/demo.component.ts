import { Component } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyErrorModule],
})
export class DemoComponent {
  protected customAction(): void {
    alert('action clicked!');
  }
}
