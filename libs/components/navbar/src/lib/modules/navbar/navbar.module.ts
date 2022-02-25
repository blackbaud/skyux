import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyNavbarItemComponent } from './navbar-item.component';

import { SkyNavbarComponent } from './navbar.component';

@NgModule({
  declarations: [SkyNavbarComponent, SkyNavbarItemComponent],
  imports: [CommonModule],
  exports: [SkyNavbarComponent, SkyNavbarItemComponent],
})
export class SkyNavbarModule {}
