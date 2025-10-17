import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KeyInfoComponent } from './key-info.component';

const routes: Routes = [{ path: '', component: KeyInfoComponent }];
@NgModule({
  imports: [KeyInfoComponent, RouterModule.forChild(routes)],
  exports: [KeyInfoComponent],
})
export class KeyInfoModule {}
