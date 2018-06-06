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
  public childRoutes: StacheNavLink[];

  public constructor(
    private routeService: StacheRouteService) { }

  public ngOnInit(): void {

    if (!this.routes) {
      this.routes = this.routeService.getActiveRoutes();
    }

    this.childRoutes = this.filterRoutes(this.routes);
  }

  public isHeadingActive(): boolean {
    const url = this.routeService.getActiveUrl();
    return (url === this.headingRoute);
  }

  private filterRoutes(routes: StacheNavLink[]): StacheNavLink[] {
    const root = routes[0];
    let headingPath = Array.isArray(root.path) ? root.path.join('/') : root.path;
    headingPath = headingPath.replace(/^\//, '');
    this.heading = root.name;

    this.headingRoute = `/${headingPath}`;

    return root.children;
  }
}
