import { Component, Input, OnInit } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';
import { StacheRouteService } from '../shared';

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent implements StacheNav, OnInit {
  @Input()
  public routes: StacheNavLink[];
  public heading: string;
  public headingRoute: string | string[];

  public constructor(
    private routeService: StacheRouteService) { }

  public ngOnInit(): void {
    if (!this.routes) {
      const activeRoutes = this.routeService.getActiveRoutes();
      this.routes = this.filterRoutes(activeRoutes);
    }
  }

  public isHeadingActive(): boolean {
    const url = this.routeService.getActiveUrl();
    return (url === this.headingRoute);
  }

  private filterRoutes(activeRoutes: StacheNavLink[]): StacheNavLink[] {
    const root = activeRoutes[0];

    this.heading = root.name;
    this.headingRoute = `/${root.path}`;

    return root.children;
  }
}
