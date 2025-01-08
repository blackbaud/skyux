import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIconModule],
})
export class DemoComponent {
  protected textButtonClick(): void {
    alert('Text with icon button clicked');
  }

  protected iconOnlyButtonClick(): void {
    alert('Icon only button clicked');
  }
}
