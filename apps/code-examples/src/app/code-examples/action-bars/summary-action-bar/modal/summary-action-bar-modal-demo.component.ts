import { Component, inject } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  standalone: true,
  selector: 'app-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-demo.component.html',
  styleUrls: ['./summary-action-bar-modal-demo.component.scss'],
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
})
export class SummaryActionBarModalDemoComponent {
  protected readonly instance = inject(SkyModalInstance);

  protected onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  protected onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
