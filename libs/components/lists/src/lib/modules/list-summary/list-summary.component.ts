import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

@Component({
  selector: 'sky-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrl: './list-summary.component.scss',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyListSummaryComponent {}
