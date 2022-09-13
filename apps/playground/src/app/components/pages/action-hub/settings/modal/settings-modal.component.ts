import { Component, Inject } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent {
  constructor(
    public instance: SkyModalInstance,
    @Inject('modalTitle') public title: string
  ) {}
}
