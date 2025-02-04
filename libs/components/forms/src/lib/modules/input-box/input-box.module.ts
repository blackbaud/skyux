import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyThemeModule } from '@skyux/theme';

import { SkyCharacterCounterModule } from '../character-counter/character-counter.module';
import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyInputBoxControlDirective } from './input-box-control.directive';
import { SkyInputBoxHintTextPipe } from './input-box-hint-text.pipe';
import { SkyInputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [SkyInputBoxComponent],
  imports: [
    CommonModule,
    SkyCharacterCounterModule,
    SkyFormErrorsModule,
    SkyFormErrorModule,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyInputBoxControlDirective,
    SkyInputBoxHintTextPipe,
    SkyThemeModule,
  ],
  exports: [
    SkyInputBoxHintTextPipe,
    SkyInputBoxComponent,
    SkyInputBoxControlDirective,
    SkyFormErrorModule,
  ],
})
export class SkyInputBoxModule {}
