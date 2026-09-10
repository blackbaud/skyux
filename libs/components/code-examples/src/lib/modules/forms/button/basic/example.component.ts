import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';

/**
 * @title Button with basic setup
 */
@Component({
  selector: 'app-forms-button-example',
  templateUrl: 'example.component.html',
  imports: [SkyButton],
  standalone: true,
})
export class FormsButtonExampleComponent {
  protected buttonClick(): void {
    alert('hi');
  }
}
