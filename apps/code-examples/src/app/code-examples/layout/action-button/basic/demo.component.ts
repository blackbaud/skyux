import { Component } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyActionButtonModule],
})
export class DemoComponent {
  public filterActionClick(): void {
    alert('Filter action clicked');
  }

  public openActionClick(): void {
    alert('Open action clicked');
  }
}
