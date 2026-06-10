import { Component, inject } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  imports: [SkyIdModule, SkyInputBoxModule, SkyModalModule],
})
export class SettingsModalComponent {
  public readonly instance = inject(SkyModalInstance);
  public readonly title = inject<string>('modalTitle' as never);
}
