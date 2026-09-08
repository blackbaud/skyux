import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';

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
