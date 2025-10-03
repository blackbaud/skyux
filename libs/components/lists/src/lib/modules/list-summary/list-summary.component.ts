import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Displays a horizontal list of summary statistics or key metrics in a consistent layout.
 */
@Component({
  selector: 'sky-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrl: './list-summary.component.scss',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyListSummaryComponent {}
