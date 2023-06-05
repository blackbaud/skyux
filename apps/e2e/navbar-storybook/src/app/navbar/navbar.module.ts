import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from './navbar.component';

const routes: Routes = [{ path: '', component: NavbarComponent }];
@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [NavbarComponent],
})
export class NavbarModule {}
