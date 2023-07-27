import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyCharacterCounterModule } from '../character-counter/character-counter.module';

import { SkyInputBoxControlDirective } from './input-box-control.directive';
import { SkyInputBoxErrorsComponent } from './input-box-errors.component';
import { SkyInputBoxHelpInlineComponent } from './input-box-help-inline.component';
import { SkyInputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [SkyInputBoxComponent],
  imports: [
    CommonModule,
    SkyCharacterCounterModule,
    SkyInputBoxControlDirective,
    SkyInputBoxErrorsComponent,
    SkyInputBoxHelpInlineComponent,
    SkyThemeModule,
  ],
  exports: [SkyInputBoxComponent, SkyInputBoxControlDirective],
})
export class SkyInputBoxModule {}
