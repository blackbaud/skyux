import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';

import { CharacterCountDemoComponent } from './character-count-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  declarations: [CharacterCountDemoComponent],
  exports: [CharacterCountDemoComponent],
})
export class SkyCharacterCountDemoModule {}
