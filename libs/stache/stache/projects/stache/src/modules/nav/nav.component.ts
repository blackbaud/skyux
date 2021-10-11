import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  StacheNavLink
} from './nav-link';

import {
  StacheNav
} from './nav';

import {
  StacheRouteService
} from '../router/route.service';

import {
  StacheAuthService
} from '../auth/auth.service';

@Component({
  selector: 'stache-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class StacheNavComponent implements OnDestroy, OnInit, StacheNav {

  @Input()
  public set routes(value: StacheNavLink[]) {
    this._routes = value;
    this.filteredRoutes = this.filterRestrictedRoutes(this.routes, this.isAuthenticated);
    this.assignActiveStates();
  }

  public get routes(): StacheNavLink[] {
    return this._routes;
  }

  @Input()
  public navType: string;

  public set isAuthenticated(value: boolean) {
    if (value !== this._isAuthenticated) {
      this._isAuthenticated = value;
      this.filteredRoutes = this.filterRestrictedRoutes(this.routes, value);
    }
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated || false;
  }

  public classname: string = '';

  public filteredRoutes: StacheNavLink[];

  private ngUnsubscribe = new Subject<void>();

  private _isAuthenticated: boolean;

  private _routes: StacheNavLink[];

  public constructor(
    private routeService: StacheRouteService,
    private authService: StacheAuthService
  ) { }

  public ngOnInit(): void {
    if (this.navType) {
      this.classname = `stache-nav-${this.navType}`;
    }

    this.assignActiveStates();

    this.authService.isAuthenticated
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public hasRoutes(): boolean {
    return (Array.isArray(this.filteredRoutes) && this.filteredRoutes.length > 0);
  }

  public hasChildRoutes(route: StacheNavLink): boolean {
    return Array.isArray(route.children);
  }

  private assignActiveStates() {
    const activeUrl = this.routeService.getActiveUrl();
    if (this.hasRoutes()) {
      this.filteredRoutes.forEach((route) => {
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

  private filterRestrictedRoutes(routes: StacheNavLink[], isAuthenticated: boolean): StacheNavLink[] {
    if (!routes || routes.length === 0 || isAuthenticated) {
      return routes;
    }

    return routes.filter(route => {
      return !route.restricted;
    });
  }
}
