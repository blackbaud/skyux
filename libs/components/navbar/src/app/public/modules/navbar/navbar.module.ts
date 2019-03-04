import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SkyNavbarItemComponent } from './navbar-item.component';
import { SkyNavbarComponent } from './navbar.component';

@NgModule({
  declarations: [
    SkyNavbarComponent,
    SkyNavbarItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SkyNavbarComponent,
    SkyNavbarItemComponent
  ]
})
export class SkyNavbarModule { }
