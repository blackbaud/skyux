import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StacheWindowRef } from '../shared/window-ref';

import { StachePageAnchorComponent } from './page-anchor.component';
import { StachePageAnchorService } from './page-anchor.service';

@NgModule({
  declarations: [StachePageAnchorComponent],
  imports: [CommonModule, RouterModule],
  providers: [StachePageAnchorService, StacheWindowRef],
  exports: [StachePageAnchorComponent],
})
export class StachePageAnchorModule {}
