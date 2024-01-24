import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { CharacterCounterRoutingModule } from './character-counter-routing.module';
import { CharacterCounterComponent } from './character-counter.component';

@NgModule({
  declarations: [CharacterCounterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
    CharacterCounterRoutingModule,
  ],
})
export class CharacterCounterModule {
  public static routes = CharacterCounterRoutingModule.routes;
}
