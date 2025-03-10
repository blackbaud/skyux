import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyBackToTopModule, SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

@Component({
  selector: 'app-modal-viewkept-toolbars-modal',
  templateUrl: './modal-viewkept-toolbars-modal.component.html',
  styleUrls: ['./modal-viewkept-toolbars-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkySummaryActionBarModule,
    SkyBackToTopModule,
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
  protected readonly modalInstance = inject(SkyModalInstance);
}
