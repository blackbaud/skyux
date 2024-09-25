import { Component, ViewChild, inject } from '@angular/core';
import { SkySummaryActionBarModule, λ3 } from '@skyux/action-bars';
import { SkyOverlayLegacyService } from '@skyux/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule],
})
export class DemoComponent {
  @ViewChild(λ3, { static: true })
  public bad!: λ3;

  public svc = inject(SkyOverlayLegacyService);

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
