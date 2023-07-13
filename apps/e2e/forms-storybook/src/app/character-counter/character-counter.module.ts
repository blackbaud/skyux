import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';

import { CharacterCounterComponent } from './character-counter.component';

const routes: Routes = [{ path: '', component: CharacterCounterComponent }];
@NgModule({
  declarations: [CharacterCounterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SkyInputBoxModule,
    SkyCharacterCounterModule,
    ReactiveFormsModule,
    SkyIdModule,
  ],
  exports: [CharacterCounterComponent],
})
export class CharacterCounterModule {}
