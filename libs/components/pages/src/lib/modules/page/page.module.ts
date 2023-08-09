import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageHeaderModule } from '../page-header/page-header.module';

import { SkyPageContentComponent } from './page-content.component';
import { SkyPageComponent } from './page.component';

@NgModule({
  declarations: [SkyPageComponent, SkyPageContentComponent],
  imports: [CommonModule],
  exports: [SkyPageComponent, SkyPageHeaderModule, SkyPageContentComponent],
})
export class SkyPageModule {}
