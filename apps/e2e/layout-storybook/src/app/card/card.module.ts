import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyCardModule } from '@skyux/layout';

import { CardComponent } from './card.component';

const routes: Routes = [{ path: '', component: CardComponent }];
@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyCardModule],
  exports: [CardComponent],
})
export class CardModule {}
