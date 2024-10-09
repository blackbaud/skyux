import { Component, Input, inject } from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyIconStackItem } from './icon-stack-item';

/**
 * @internal
 */
@Component({
  selector: 'sky-icon-stack',
  templateUrl: './icon-stack.component.html',
  styleUrls: ['./icon-stack.component.scss'],
})
export class SkyIconStackComponent {
  /**
   * The size of the icon using
   * [Font Awesome sizes](https://fontawesome.com/v4/examples/).
   */
  @Input()
  public size: string | undefined;

  /**
   * The icon to display at the bottom of the stack.
   */
  @Input()
  public baseIcon: SkyIconStackItem | undefined;

  /**
   * The icon to display at the top of the stack.
   */
  @Input()
  public topIcon: SkyIconStackItem | undefined;

  protected themeSvc = inject(SkyThemeService, { optional: true });
}
