import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyIdModule } from '@skyux/core';

import { SkyIconModule } from '@skyux/indicators';

import { SkyDropdownModule } from '@skyux/popovers';

import { SkyThemeModule } from '@skyux/theme';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkySortItemComponent } from './sort-item.component';

import { SkySortMenuHeadingComponent } from './sort-menu-heading.component';

import { SkySortComponent } from './sort.component';

@NgModule({
  declarations: [
    SkySortComponent,
    SkySortItemComponent,
    SkySortMenuHeadingComponent,
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyIdModule,
    SkyListsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkySortComponent, SkySortItemComponent],
})
export class SkySortModule {}
