import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageHeaderModule } from '../page-header/page-header.module';

import { SkyPageContentComponent } from './page-content.component';
import { SkyPageLinksComponent } from './page-links.component';
import { SkyPageComponent } from './page.component';

@NgModule({
  declarations: [
    SkyPageComponent,
    SkyPageContentComponent,
    SkyPageLinksComponent,
  ],
  imports: [CommonModule],
  exports: [
    SkyPageComponent,
    SkyPageHeaderModule,
    SkyPageContentComponent,
    SkyPageLinksComponent,
  ],
})
export class SkyPageModule {}
