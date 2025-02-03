import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-icon-icon-button-example',
  templateUrl: './example.component.html',
  imports: [SkyIconModule],
})
export class IconIconButtonExampleComponent {
  protected textButtonClick(): void {
    alert('Text with icon button clicked');
  }

  protected iconOnlyButtonClick(): void {
    alert('Icon only button clicked');
  }
}
