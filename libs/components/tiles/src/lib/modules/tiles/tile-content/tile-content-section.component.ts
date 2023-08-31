import { Component } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies content to display inside a padded section of a SkyTileContentComponent.
 */
@Component({
  standalone: true,
  selector: 'sky-tile-content-section',
  styleUrls: ['./tile-content-section.component.scss'],
  templateUrl: './tile-content-section.component.html',
  imports: [SkyThemeModule],
})
export class SkyTileContentSectionComponent {}
