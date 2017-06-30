import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { StacheConfigService, StacheRouteMetadataService } from '../shared';
import { StacheNavLink } from './nav-link';

@Injectable()
export class StacheNavService {
  private activeRoutes: StacheNavLink[];

  public constructor(
    private router: Router,
    private configService: StacheConfigService,
    private routeMetadataService: StacheRouteMetadataService) {
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
    const appRoutes = this.clone(this.configService.runtime.routes);

    let activeChildRoutes = appRoutes
      .filter((route: any) => {
        return (route.routePath.indexOf(rootPath) === 0);
      })
      .map((route: any) => {
        return {
          segments: route.routePath.split('/'),
          path: route.routePath
        };
      });

    let activeRoutes = [{
      path: rootPath,
      segments: [rootPath],
      children: this.assignChildren(activeChildRoutes, rootPath)
    }];

    this.activeRoutes = this.formatRoutes(activeRoutes);

    return this.clone(this.activeRoutes) as StacheNavLink[];
  }

  public getActiveUrl(): string {
    return this.router.url.split('#')[0];
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

    routes.forEach(route => {
      const routeDepth = route.segments.length;
      const isChildRoute = (depth === routeDepth && route.path.indexOf(parentPath) > -1);

      if (isChildRoute) {
        route.children = this.assignChildren(routes, route.path);
        assignedRoutes.push(route);
      }
    });

    return assignedRoutes;
  }

  private formatRoutes(routes: any[]): StacheNavLink[] {
    let formatted = routes.map(route => {
      let pathMetadata = this.getRouteMetadata(route);

      let formattedRoute = Object.assign({},
        {
          path: `/${route.path}`,
          children: this.formatRoutes(route.children),
          name: this.getNameFromPath(route.segments[route.segments.length - 1])
        },
        pathMetadata);

      return formattedRoute as any;
    });

    return this.sortRoutes(formatted) as StacheNavLink[];
  }

  private getRouteMetadata(route: any): any {
    const allMetadata = this.routeMetadataService.metadata;

    if (allMetadata) {
      let foundRoute = allMetadata.filter((metaRoute: any) => {
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private sortRoutes(routes: StacheNavLink[]): StacheNavLink[] {

    const sortByName = (a: any, b: any): number  => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    };

    const sortByOrder = (a: any, b: any): number => {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      } else {
        return 0;
      }
    };

    const orderedRoutes = routes.filter(route => route.hasOwnProperty('order'))
      .sort(sortByName)
      .sort(sortByOrder);

    const unorderedRoutes = routes.filter(route => !route.hasOwnProperty('order'))
      .sort(sortByName);

    const sortedRoutes = orderedRoutes.concat(unorderedRoutes);

    return sortedRoutes;
  }
}
