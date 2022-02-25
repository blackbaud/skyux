import { Component, Input } from '@angular/core';

import { SkyIconStackItem } from './icon-stack-item';

@Component({
  selector: 'sky-icon-stack',
  templateUrl: './icon-stack.component.html',
  styleUrls: ['./icon-stack.component.scss'],
})
export class SkyIconStackComponent {
  /**
   * Specifies the size of the icon using
   * [Font Awesome sizes](https://fontawesome.com/how-to-use/on-the-web/styling/sizing-icons).
   */
  @Input()
  public size: string;

  /**
   * The icon to display at the bottom of the stack.
   */
  @Input()
  public baseIcon: SkyIconStackItem;

  /**
   * The icon to display at the top of the stack.
   */
  @Input()
  public topIcon: SkyIconStackItem;
}
