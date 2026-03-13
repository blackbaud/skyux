import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyThemeService } from '@skyux/theme';

import { SkyModalModule } from '../modal.module';

import { ModalMockThemeService } from './mock-theme.service';
import { ModalAutofocusTestComponent } from './modal-autofocus.component.fixture';
import { ModalBannerTestComponent } from './modal-banner.component.fixture';
import { ModalFooterTestComponent } from './modal-footer.component.fixture';
import { ModalIsDirtyTestComponent } from './modal-is-dirty.component.fixture';
import { ModalLauncherTestComponent } from './modal-launcher.component.fixture';
import { ModalNoHeaderTestComponent } from './modal-no-header.component.fixture';
import { ModalTiledBodyTestComponent } from './modal-tiled-body.component.fixture';
import { ModalWithCloseConfirmTestComponent } from './modal-with-close-confirm.component.fixture';
import { ModalWithFocusContentTestComponent } from './modal-with-focus-content.fixture';
import { ModalWithScrollingContentTestComponent } from './modal-with-scrolling-content.fixture.component';
import { ModalWithValuesTestComponent } from './modal-with-values.component.fixture';
import { ModalTestComponent } from './modal.component.fixture';

@NgModule({
  declarations: [
    ModalTestComponent,
    ModalWithValuesTestComponent,
    ModalAutofocusTestComponent,
    ModalBannerTestComponent,
    ModalFooterTestComponent,
    ModalNoHeaderTestComponent,
    ModalTiledBodyTestComponent,
    ModalWithFocusContentTestComponent,
    ModalWithCloseConfirmTestComponent,
    ModalLauncherTestComponent,
    ModalWithScrollingContentTestComponent,
    ModalIsDirtyTestComponent,
  ],
  imports: [RouterModule, SkyModalModule],
  providers: [
    {
      provide: SkyThemeService,
      useClass: ModalMockThemeService,
    },
  ],
})
export class SkyModalFixturesModule {}
