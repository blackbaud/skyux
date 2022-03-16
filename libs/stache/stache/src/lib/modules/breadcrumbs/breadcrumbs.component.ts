import { Component, Input, OnInit } from '@angular/core';

import { StacheNav } from '../nav/nav';
import { StacheNavLink } from '../nav/nav-link';
import { StacheRouteService } from '../router/route.service';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class StacheBreadcrumbsComponent implements StacheNav, OnInit {
  @Input()
  public routes: StacheNavLink[];

  public constructor(private routeService: StacheRouteService) {}

  public ngOnInit(): void {
    if (!this.routes) {
      const activeRoutes = this.routeService.getActiveRoutes();
      this.routes = this.filterRoutes(activeRoutes);
    }
  }

  private filterRoutes(activeRoutes: StacheNavLink[]): StacheNavLink[] {
    const root = activeRoutes[0];
    const breadcrumbRoutes: StacheNavLink[] = [];

    breadcrumbRoutes.push({
      name: 'Home',
      path: '/',
    });

    if (root.path === '') {
      return breadcrumbRoutes;
    }

    breadcrumbRoutes.push({
      name: root.name,
      path: root.path,
    });

    const addRoute = (route: StacheNavLink) => {
      breadcrumbRoutes.push({
        name: route.name,
        path: route.path,
      });

      if (route.children && route.children.length) {
        this.findActiveBranch(route.children, addRoute);
      }
    };

    this.findActiveBranch(root.children, addRoute);

    return breadcrumbRoutes;
  }

  private findActiveBranch(
    routes: StacheNavLink[],
    callback: (navLink: StacheNavLink) => void
  ) {
    const activeUrl = `${this.routeService.getActiveUrl()}/`;
    routes.forEach((route: StacheNavLink) => {
      if (activeUrl.indexOf(`/${route.path}/`) === 0) {
        callback(route);
      }
    });
  }
}
