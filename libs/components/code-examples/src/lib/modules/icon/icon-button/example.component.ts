import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

/**
 * @title Icons in buttons
 */
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
