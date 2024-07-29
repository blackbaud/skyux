import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { CheckboxRoutingModule } from './checkbox-routing.module';
import { CheckboxComponent } from './checkbox.component';

const routes: Routes = [{ path: '', component: CheckboxComponent }];

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    CheckboxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyCheckboxModule,
    SkyHelpInlineModule,
  ],
})
export class CheckboxModule {
  public static routes = CheckboxRoutingModule.routes;
}
