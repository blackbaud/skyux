import { Component, Input, OnInit } from '@angular/core';

import { StacheNav, StacheNavLink, StacheNavService } from '../nav';

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent implements StacheNav, OnInit {
  @Input()
  public routes: StacheNavLink[];

  public constructor(
    private navService: StacheNavService) { }

  public ngOnInit(): void {
    if (!this.routes) {
      const activeRoutes = this.navService.getActiveRoutes();
      this.routes = this.filterRoutes(activeRoutes);
    }
  }

  private filterRoutes(activeRoutes: StacheNavLink[]): StacheNavLink[] {
    const root = activeRoutes[0];

    root.children.unshift({
      name: 'Overview',
      path: root.path
    } as StacheNavLink);

    return root.children;
  }
}
