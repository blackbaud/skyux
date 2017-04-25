import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { StacheNavLink } from './nav-link';

@Injectable()
export class StacheNavService {
  private activeRoutes: StacheNavLink[];

  public constructor(
    private appConfig: SkyAppConfig,
    private router: Router
  ) {
    router.events.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
        this.clearActiveRoutes();
      }
    });
  }

  public getActiveUrl(): string {
    return this.router.url.split('#')[0];
  }

  public getActiveRoutes(): StacheNavLink[] {
    if (this.activeRoutes) {
      return this.activeRoutes;
    }

    const rootPath = this.getActiveUrl().replace(/^\//, '').split('/')[0];
    const appRoutes = this.clone(this.appConfig.runtime.routes);

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
      children: this.orderRoutes(activeChildRoutes, rootPath)
    }];

    this.activeRoutes = this.formatRoutes(activeRoutes);

    return this.clone(this.activeRoutes) as StacheNavLink[];
  }

  public clearActiveRoutes() {
    this.activeRoutes = undefined;
  }

  private orderRoutes(routes: any[], parentPath: string): any[] {
    const ordered: any[] = [];
    const depth = parentPath.split('/').length + 1;

    routes.forEach(route => {
      const routeDepth = route.segments.length;
      const isChildRoute = (depth === routeDepth && route.path.indexOf(parentPath) > -1);

      if (isChildRoute) {
        route.children = this.orderRoutes(routes, route.path);
        ordered.push(route);
      }
    });

    return ordered;
  }

  private formatRoutes(routes: any[]): StacheNavLink[] {
    let formatted = routes.map(route => {
      return {
        name: this.getNameFromPath(route.segments[route.segments.length - 1]),
        path: `/${route.path}`,
        children: this.formatRoutes(route.children)
      } as any;
    });

    return formatted as StacheNavLink[];
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

  private clone(thing: any): any {
    return JSON.parse(JSON.stringify(thing));
  }
}
