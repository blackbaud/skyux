import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyInlineFormModule } from '@skyux/inline-form';

import { InlineFormComponent } from './inline-form.component';

const routes: Routes = [{ path: '', component: InlineFormComponent }];
@NgModule({
  declarations: [InlineFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
    RouterModule.forChild(routes),
  ],
  exports: [InlineFormComponent],
})
export class InlineFormModule {}
