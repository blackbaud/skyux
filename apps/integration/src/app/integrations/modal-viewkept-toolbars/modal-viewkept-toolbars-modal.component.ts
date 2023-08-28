import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

@Component({
  standalone: true,
  selector: 'app-modal-viewkept-toolbars-modal',
  templateUrl: './modal-viewkept-toolbars-modal.component.html',
  styleUrls: ['./modal-viewkept-toolbars-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyI18nModule,
    SkyModalModule,
    SkySearchModule,
    SkyThemeModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
  ],
})
export class ModalViewkeptToolbarsModalComponent {
  public readonly modalInstance = inject(SkyModalInstance);
}
