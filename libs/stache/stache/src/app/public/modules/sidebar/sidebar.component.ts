import {
  Component,
  Input
} from '@angular/core';

import {
  StacheNavLink
} from '../nav/nav-link';

import {
  StacheNav
} from '../nav/nav';

import {
  StacheRouteService
} from '../router/route.service';

let uniqueId = 0;

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent implements StacheNav {

  @Input()
  public set routes(value: StacheNavLink[]) {
    if (
      !value ||
      !value.length ||
      !Array.isArray(value)
    ) {
      this._routes = this.routeService.getActiveRoutes();
    } else {
      this._routes = value;
    }

    this.childRoutes = this.filterRoutes(this._routes);
  }

  public childRoutes: StacheNavLink[];
  public heading: string;
  public headingRoute: string | string[];
  public sidebarHeadingElementId = `stache-sidebar-heading-${uniqueId++}`;

  private _routes: StacheNavLink[];

  public constructor(
    private routeService: StacheRouteService
  ) { }

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
