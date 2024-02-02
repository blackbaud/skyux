import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyCharacterCounterModule } from '../character-counter/character-counter.module';
import { SkyFormErrorsComponent } from '../form-error/form-errors.component';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyInputBoxControlDirective } from './input-box-control.directive';
import { SkyInputBoxHelpInlineComponent } from './input-box-help-inline.component';
import { SkyInputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [SkyInputBoxComponent],
  imports: [
    CommonModule,
    SkyCharacterCounterModule,
    SkyFormErrorsComponent,
    SkyFormsResourcesModule,
    SkyInputBoxControlDirective,
    SkyInputBoxHelpInlineComponent,
    SkyThemeModule,
  ],
  exports: [SkyInputBoxComponent, SkyInputBoxControlDirective],
})
export class SkyInputBoxModule {}
