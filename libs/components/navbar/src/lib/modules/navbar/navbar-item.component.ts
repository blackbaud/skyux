import { Component, Input } from '@angular/core';

/**
 * Displays a navigation item in the navbar. It can include sub-navigation items in
 * a dropdown menu.
 */
@Component({
  selector: 'sky-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss'],
  standalone: false,
})
export class SkyNavbarItemComponent {
  /**
   * Whether the navigation item is active.
   * @default false
   */
  @Input()
  public active: boolean | undefined;
}
