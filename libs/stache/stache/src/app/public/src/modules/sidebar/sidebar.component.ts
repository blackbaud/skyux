import { Component, Input } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';
import { StacheRouteService } from '../shared';

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent implements StacheNav {
  @Input()
  public set routes(value: StacheNavLink[]) {
    this._routes = value ? value : this.routeService.getActiveRoutes();
    this.childRoutes = this.filterRoutes(this._routes);
  }

  public get routes(): StacheNavLink[] {
    return this._routes;
  }

  private _routes: StacheNavLink[];
  public heading: string;
  public headingRoute: string | string[];
  public childRoutes: StacheNavLink[];

  public constructor(private routeService: StacheRouteService) { }

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
