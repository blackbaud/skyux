import { Component } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyActionButtonModule],
})
export class DemoComponent {
  protected filterActionClick(): void {
    alert('Filter action clicked');
  }

  protected openActionClick(): void {
    alert('Open action clicked');
  }
}
