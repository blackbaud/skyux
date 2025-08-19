import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Specifies an action that users can perform on the card.
 * @deprecated
 */
@Component({
  selector: 'sky-card-actions',
  templateUrl: './card-actions.component.html',
  styleUrls: ['./card-actions.component.scss'],
  standalone: false,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyCardActionsComponent {}
