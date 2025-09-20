import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Specifies a header to display on an action button.
 */
@Component({
  selector: 'sky-action-button-header',
  styleUrls: [
    './action-button-header.default.component.scss',
    './action-button-header.modern.component.scss',
  ],
  templateUrl: './action-button-header.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
  standalone: false,
})
export class SkyActionButtonHeaderComponent {}
