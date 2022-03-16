import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheResourcesModule } from '../shared/stache-resources.module';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheBackToTopComponent } from './back-to-top.component';

@NgModule({
  declarations: [StacheBackToTopComponent],
  imports: [CommonModule, StacheResourcesModule],
  exports: [StacheBackToTopComponent],
  providers: [StacheWindowRef],
})
export class StacheBackToTopModule {}
