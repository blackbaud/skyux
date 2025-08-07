import { Component } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';

/**
 * @title Basic action buttons
 */
@Component({
  selector: 'app-layout-action-button-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyActionButtonModule],
})
export class LayoutActionButtonBasicExampleComponent {
  protected filterActionClick(): void {
    alert('Filter action clicked');
  }

  public openActionClick(): void {
    alert('Open action clicked');
  }
}
