import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyConfirmModule } from '@skyux/modals';

import { ConfirmDemoComponent } from './confirm-demo.component';

@NgModule({
  imports: [CommonModule, FormsModule, SkyConfirmModule],
  declarations: [ConfirmDemoComponent],
  exports: [ConfirmDemoComponent],
})
export class ConfirmDemoModule {}
