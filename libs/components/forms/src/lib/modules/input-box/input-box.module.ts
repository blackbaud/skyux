import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyCharacterCounterModule } from '../character-counter/character-counter.module';
import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyInputBoxControlDirective } from './input-box-control.directive';
import { SkyInputBoxHelpInlineComponent } from './input-box-help-inline.component';
import { SkyInputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [SkyInputBoxComponent],
  imports: [
    CommonModule,
    SkyCharacterCounterModule,
    SkyFormErrorsModule,
    SkyFormErrorModule,
    SkyFormsResourcesModule,
    SkyInputBoxControlDirective,
    SkyInputBoxHelpInlineComponent,
    SkyThemeModule,
  ],
  exports: [
    SkyInputBoxComponent,
    SkyInputBoxControlDirective,
    SkyFormErrorModule,
  ],
})
export class SkyInputBoxModule {}
