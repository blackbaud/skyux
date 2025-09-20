import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Displays additional information in the page header, like record details.
 * Appears below the title and above the page actions.
 */
@Component({
  selector: 'sky-page-header-details',
  templateUrl: './page-header-details.component.html',
  styleUrls: ['./page-header-details.component.scss'],
  standalone: false,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyPageHeaderDetailsComponent {}
