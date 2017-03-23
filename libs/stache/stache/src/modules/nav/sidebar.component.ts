import { Component, Input } from '@angular/core';

import { StacheNavLink } from './nav-link';

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent {
  @Input()
  public routes: StacheNavLink[];
}
