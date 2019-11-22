import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  StacheNavLink
} from './nav-link';

import {
  StacheNav
} from './nav';

import {
  StacheRouteService
} from '../router/route.service';

@Component({
  selector: 'stache-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class StacheNavComponent implements OnInit, StacheNav {
  @Input()
  public set routes(value: StacheNavLink[]) {
    this._routes = value;
    this.assignActiveStates();
  }

  public get routes(): StacheNavLink[] {
    return this._routes;
  }

  @Input()
  public navType: string;

  public classname: string = '';

  private _routes: StacheNavLink[];

  public constructor(
    private routeService: StacheRouteService
  ) { }

  public hasRoutes(): boolean {
    return (Array.isArray(this.routes) && this.routes.length > 0);
  }

  public hasChildRoutes(route: StacheNavLink): boolean {
    return Array.isArray(route.children);
  }

  public ngOnInit(): void {
    if (this.navType) {
      this.classname = `stache-nav-${this.navType}`;
    }

    this.assignActiveStates();
  }

  private assignActiveStates() {
    const activeUrl = this.routeService.getActiveUrl();
    if (this.hasRoutes()) {
      this.routes.forEach((route) => {
        route.isActive = this.isActive(activeUrl, route);
        route.isCurrent = this.isCurrent(activeUrl, route);
      });
    }
  }

  private isActive(activeUrl: string, route: any): boolean {
    let path = route.path;
    let navDepth: number;

    if (path.join) {
      navDepth = path.length;
      path = path.join('/');
    } else {
      navDepth = path.split('/').length;
    }

    if (path.indexOf('/') !== 0) {
      path = `/${path}`;
    }

    const isActiveParent = (navDepth > 1 && `${activeUrl}/`.indexOf(`${path}/`) === 0);

    return (isActiveParent || activeUrl === path);
  }

  private isCurrent(activeUrl: string, route: any): boolean {
    let path = route.path;

    if (path.join) {
      path = path.join('/');
    }

    return (activeUrl === `/${path}`);
  }
}
