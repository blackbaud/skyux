import { Component, contentChild } from '@angular/core';
import { SkySummaryActionBarModule, λ2 } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule],
})
export class DemoComponent {
  protected foo = contentChild(λ2);

  protected onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  protected onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  protected onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
