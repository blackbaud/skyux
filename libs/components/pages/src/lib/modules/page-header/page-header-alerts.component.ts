import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Displays alerts within the page header and applies spacing between alerts. Appears above the page title.
 */
@Component({
  selector: 'sky-page-header-alerts',
  templateUrl: './page-header-alerts.component.html',
  styleUrls: ['./page-header-alerts.component.scss'],
  standalone: false,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyPageHeaderAlertsComponent {}
