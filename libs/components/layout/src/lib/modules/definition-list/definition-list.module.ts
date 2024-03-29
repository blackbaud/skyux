import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyDefinitionListContentComponent } from './definition-list-content.component';
import { SkyDefinitionListHeadingComponent } from './definition-list-heading.component';
import { SkyDefinitionListLabelComponent } from './definition-list-label.component';
import { SkyDefinitionListValueComponent } from './definition-list-value.component';
import { SkyDefinitionListComponent } from './definition-list.component';

/**
 * @deprecated Use `SkyDescriptionListModule` instead.
 */
@NgModule({
  declarations: [
    SkyDefinitionListComponent,
    SkyDefinitionListContentComponent,
    SkyDefinitionListHeadingComponent,
    SkyDefinitionListLabelComponent,
    SkyDefinitionListValueComponent,
  ],
  imports: [CommonModule, SkyLayoutResourcesModule],
  exports: [
    SkyDefinitionListComponent,
    SkyDefinitionListContentComponent,
    SkyDefinitionListHeadingComponent,
    SkyDefinitionListLabelComponent,
    SkyDefinitionListValueComponent,
  ],
})
export class SkyDefinitionListModule {}
