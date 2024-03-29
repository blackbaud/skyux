import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkyInlineDeleteModule } from '../inline-delete/inline-delete.module';
import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyCardActionsComponent } from './card-actions.component';
import { SkyCardContentComponent } from './card-content.component';
import { SkyCardTitleComponent } from './card-title.component';
import { SkyCardComponent } from './card.component';

/**
 * @deprecated `SkyCardModule` is deprecated. For other SKY UX components that group and list content, see the content containers guidelines. For more information, see https://developer.blackbaud.com/skyux/design/guidelines/content-containers.
 */
@NgModule({
  declarations: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyLayoutResourcesModule,
    SkyInlineDeleteModule,
  ],
  exports: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent,
  ],
})
export class SkyCardModule {}
