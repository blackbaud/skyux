import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StacheNavLink } from './nav-link';
import { StacheNav } from './nav';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class StacheNavComponent implements OnInit, StacheNav {
  @Input()
  public routes: StacheNavLink[];

  @Input()
  public navType: string;

  public classname: string = '';

  public constructor(
    private router: Router,
    private windowRef: StacheWindowRef) { }

  public hasRoutes(): boolean {
    return (Array.isArray(this.routes) && this.routes.length > 0);
  }

  public hasChildRoutes(route: StacheNavLink): boolean {
    return Array.isArray(route.children);
  }

  public scrollToElement(id: string) {
    let element = this.windowRef.nativeWindow.document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public navigate(route: any): void {
    let extras: any = {};

    if (route.fragment) {
      extras.fragment = route.fragment;
      this.scrollToElement(route.fragment);
      return;
    }

    if (Array.isArray(route.path)) {
      this.router.navigate(route.path, extras);
    } else {
      this.router.navigate([route.path], extras);
    }
  }

  public ngOnInit(): void {
    if (this.navType) {
      this.classname = `stache-nav-${this.navType}`;
    }

    this.assignActiveStates();
  }

  private assignActiveStates() {
    const activeUrl = this.router.url.split('#')[0];
    if (this.hasRoutes()) {
      this.routes.forEach((route: any) => {
        if (this.isActive(activeUrl, route)) {
          route.isActive = true;
        }

        if (this.isCurrent(activeUrl, route)) {
          route.isCurrent = true;
        }
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

    const isActiveParent = (navDepth > 1  && `${activeUrl}/`.indexOf(`${path}/`) === 0);

    return (isActiveParent || activeUrl === path);
  }

  private isCurrent(activeUrl: string, route: any): boolean {
    let path = route.path;

    if (path.join) {
      path = path.join('/');
    }

    return (activeUrl === path);
  }
}
