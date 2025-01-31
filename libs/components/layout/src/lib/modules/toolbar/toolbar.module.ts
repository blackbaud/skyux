import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyToolbarItemComponent } from './toolbar-item.component';
import { SkyToolbarSectionComponent } from './toolbar-section.component';
import { SkyToolbarViewActionsComponent } from './toolbar-view-actions.component';
import { SkyToolbarComponent } from './toolbar.component';

/**
 * @docsIncludeIds SkyToolbarComponent, SkyToolbarSectionComponent, SkyToolbarItemComponent, SkyToolbarViewActionsComponent, SkyToolbarHarness, SkyToolbarHarnessFilters, SkyToolbarSectionHarness, SkyToolbarSectionHarnessFilters, SkyToolbarItemHarness, SkyToolbarItemHarnessFilters, SkyToolbarViewActionsHarness
 */
@NgModule({
  declarations: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent,
    SkyToolbarViewActionsComponent,
  ],
  imports: [CommonModule],
  exports: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent,
    SkyToolbarViewActionsComponent,
  ],
})
export class SkyToolbarModule {}
