import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  RouterTestingModule
} from '@angular/router/testing';

import { SkyWindowRefService } from '@skyux/core';

import { SkyModalModule } from '../modal.module';
import { ModalTestComponent } from './modal.component.fixture';
import { ModalWithValuesTestComponent } from './modal-with-values.component.fixture';
import { ModalAutofocusTestComponent } from './modal-autofocus.component.fixture';
import { ModalFooterTestComponent } from './modal-footer.component.fixture';
import { ModalNoHeaderTestComponent } from './modal-no-header.component.fixture';
import { ModalTiledBodyTestComponent } from './modal-tiled-body.component.fixture';

@NgModule({
  declarations: [
    ModalTestComponent,
    ModalWithValuesTestComponent,
    ModalAutofocusTestComponent,
    ModalFooterTestComponent,
    ModalNoHeaderTestComponent,
    ModalTiledBodyTestComponent
  ],
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyModalModule
  ],
  providers: [
    SkyWindowRefService
  ],
  entryComponents: [
    ModalTestComponent,
    ModalWithValuesTestComponent,
    ModalAutofocusTestComponent,
    ModalFooterTestComponent,
    ModalNoHeaderTestComponent,
    ModalTiledBodyTestComponent
  ]
})
export class SkyModalFixturesModule { }
