import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

import { ModalViewkeptToolbarsModalComponent } from './modal-viewkept-toolbars-modal.component';
import { ModalViewkeptToolbarsRoutingModule } from './modal-viewkept-toolbars-routing-module';
import { ModalViewkeptToolbarsComponent } from './modal-viewkept-toolbars.component';

@NgModule({
  declarations: [
    ModalViewkeptToolbarsComponent,
    ModalViewkeptToolbarsModalComponent,
  ],
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
    ModalViewkeptToolbarsRoutingModule,
  ],
})
export class ModalViewkeptToolbarsModule {
  public static routes = ModalViewkeptToolbarsRoutingModule.routes;
}
