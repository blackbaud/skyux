import { Component, Inject } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  imports: [SkyIdModule, SkyInputBoxModule, SkyModalModule],
})
export class SettingsModalComponent {
  constructor(
    public instance: SkyModalInstance,
    @Inject('modalTitle') public title: string,
  ) {}
}
