import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [VisualComponent],
  imports: [CommonModule, RouterModule],
})
export class VisualModule {}
