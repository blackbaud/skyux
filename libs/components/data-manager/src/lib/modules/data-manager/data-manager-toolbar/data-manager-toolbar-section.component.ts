import { Component } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * A wrapper for items to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered in an additional toolbar row beneath the primary toolbar and above the multiselect
 * toolbar (if present).
 */
@Component({
  selector: 'sky-data-manager-toolbar-section',
  templateUrl: './data-manager-toolbar-section.component.html',
  imports: [SkyToolbarModule],
})
export class SkyDataManagerToolbarSectionComponent {}
