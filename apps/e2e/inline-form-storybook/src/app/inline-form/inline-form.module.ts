import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton, SkyInputBoxModule } from '@skyux/forms';
import { SkyInlineFormModule } from '@skyux/inline-form';

import { InlineFormComponent } from './inline-form.component';

const routes: Routes = [{ path: '', component: InlineFormComponent }];
@NgModule({
  declarations: [InlineFormComponent],
  imports: [
    SkyButton,
    CommonModule,
    ReactiveFormsModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
    RouterModule.forChild(routes),
  ],
  exports: [InlineFormComponent],
})
export class InlineFormModule {}
