import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyDescriptionListContentComponent } from './description-list-content.component';
import { SkyDescriptionListDescriptionComponent } from './description-list-description.component';
import { SkyDescriptionListTermComponent } from './description-list-term.component';
import { SkyDescriptionListComponent } from './description-list.component';

@NgModule({
  declarations: [
    SkyDescriptionListComponent,
    SkyDescriptionListContentComponent,
    SkyDescriptionListTermComponent,
    SkyDescriptionListDescriptionComponent,
  ],
  imports: [
    CommonModule,
    SkyLayoutResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
  ],
  exports: [
    SkyDescriptionListComponent,
    SkyDescriptionListContentComponent,
    SkyDescriptionListTermComponent,
    SkyDescriptionListDescriptionComponent,
  ],
})
export class SkyDescriptionListModule {}
