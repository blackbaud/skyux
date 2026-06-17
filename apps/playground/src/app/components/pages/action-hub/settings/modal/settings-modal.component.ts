import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

export const MODAL_TITLE_TOKEN = new InjectionToken<string>('modalTitle');

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyIdModule, SkyInputBoxModule, SkyModalModule],
})
export class SettingsModalComponent {
  public readonly instance = inject(SkyModalInstance);
  public readonly title = inject(MODAL_TITLE_TOKEN);
}
