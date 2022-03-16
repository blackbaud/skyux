import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import { StacheNavLink } from '../nav/nav-link';

import { StacheRouteMetadataService } from './route-metadata.service';

@Injectable()
export class StacheRouteService {
  private activeRoutes: StacheNavLink[];

  public constructor(
    private router: Router,
    private configService: SkyAppConfig,
    private routeMetadataService: StacheRouteMetadataService
  ) {
    router.events.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
        this.clearActiveRoutes();
      }
    });
  }

  public getActiveRoutes(): StacheNavLink[] {
    if (this.activeRoutes) {
      return this.activeRoutes;
    }

    const rootPath = this.getActiveUrl().replace(/^\//, '').split('/')[0];

    const appRoutes = this.clone(this.configService.runtime?.routes || []);

    const activeChildRoutes = appRoutes
      .filter((route: any) => {
        return route.routePath.indexOf(rootPath) === 0;
      })
      .map((route: any) => {
        return {
          segments: route.routePath.split('/'),
          path: route.routePath,
        };
      });

    const activeRoutes = [
      {
        path: rootPath,
        segments: [rootPath],
        children: this.assignChildren(activeChildRoutes, rootPath),
      },
    ];

    this.activeRoutes = this.formatRoutes(activeRoutes);

    return this.clone(this.activeRoutes) as StacheNavLink[];
  }

  public getActiveUrl(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }

  public clearActiveRoutes() {
    this.activeRoutes = undefined;
  }

  private clone(thing: any): any {
    return JSON.parse(JSON.stringify(thing));
  }

  private assignChildren(routes: any[], parentPath: string): any[] {
    const assignedRoutes: any[] = [];
    const depth = parentPath.split('/').length + 1;

    routes.forEach((route) => {
      const routeDepth = route.segments.length;

      // Adding trailing slash to force end of parent path.  Otherwise:
      // a/child, a1/child, and a2/child would have all three children displayed under a.
      const isChildRoute =
        depth === routeDepth && route.path.indexOf(parentPath + '/') > -1;

      if (isChildRoute) {
        route.children = this.assignChildren(routes, route.path);
        assignedRoutes.push(route);
      }
    });

    return assignedRoutes;
  }

  private formatRoutes(routes: any[]): StacheNavLink[] {
    const formatted = routes
      .map((route) => {
        const pathMetadata = this.getMetadata(route);

        const formattedRoute = Object.assign(
          {},
          {
            path: route.path,
            children: this.formatRoutes(route.children),
            name: this.getNameFromPath(
              route.segments[route.segments.length - 1]
            ),
          },
          pathMetadata
        );

        return formattedRoute as any;
      })
      .filter((route) => route.showInNav !== false);

    return this.sortRoutes(formatted) as StacheNavLink[];
  }

  private getMetadata(route: any): any {
    const allMetadata = this.routeMetadataService.metadata;

    if (allMetadata) {
      const foundRoute = allMetadata.filter((metaRoute: any) => {
        return metaRoute.path === route.path;
      })[0];

      if (foundRoute) {
        return foundRoute;
      }
    }

    return {};
  }

  private getNameFromPath(path: string): string {
    path = path.replace(/-/g, ' ');
    return this.toTitleCase(path);
  }

  private toTitleCase(phrase: string): string {
    return phrase
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private sortRoutes(routes: StacheNavLink[]): StacheNavLink[] {
    const sortedRoutes = routes
      .filter(
        (route: any) => !Object.prototype.hasOwnProperty.call(route, 'order')
      )
      .sort(this.sortByName);

    const routesWithNavOrder = routes
      .filter((route: any) =>
        Object.prototype.hasOwnProperty.call(route, 'order')
      )
      .sort(this.sortByName)
      .sort(this.sortByOrder);

    routesWithNavOrder.forEach((route: any) => {
      let newIdx = route.order - 1;
      const validPosition = (): boolean => newIdx < sortedRoutes.length;
      const positionPreviouslyAssigned = (): boolean =>
        sortedRoutes[newIdx].order <= route.order;

      if (validPosition()) {
        while (validPosition() && positionPreviouslyAssigned()) {
          newIdx++;
        }
        sortedRoutes.splice(newIdx, 0, route);
      } else {
        sortedRoutes.push(route);
      }
    });

    return sortedRoutes;
  }

  private sortByName(a: any, b: any): number {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    } else {
      return 0;
    }
  }

  private sortByOrder(a: any, b: any): number {
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      return 0;
    }
  }
}
