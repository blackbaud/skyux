import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StacheWindowRef } from '../shared';

@Injectable()
export class StacheNavService {
  public constructor(
    private router: Router,
    private windowRef: StacheWindowRef) { }

  public navigate(route: any): void {
    let extras: any = { queryParamsHandling: 'merge'};
    const currentPath = this.router.url.split('?')[0].split('#')[0];

    if (this.isExternal(route)) {
      this.windowRef.nativeWindow.location.href = route.path;
      return;
    }

    if (route.fragment) {
      if (this.isCurrentRoute(route.path, currentPath)) {
        this.navigateInPage(route.fragment);
        return;
      }
      extras.fragment = route.fragment;
    }

    if (Array.isArray(route.path)) {
      this.router.navigate(route.path, extras);
    } else {
      this.router.navigate([route.path], extras);
    }
  }

  private isCurrentRoute(routePath: string | string[], currentPath: string): boolean {
   let path = routePath;

   if (Array.isArray(path)) {
    path = path.join('/');
   }

   return (path === '.' || currentPath.replace(/^\//, '') === path.replace(/^\//, ''));
  }

  private navigateInPage(fragment: string): void {
    const element = this.windowRef.nativeWindow.document.querySelector(`#${fragment}`);

    if (element) {
      element.scrollIntoView();
      this.windowRef.nativeWindow.location.hash = fragment;
    } else {
      // The current page is the path intended, but no element with the fragment exists, scroll to
      // the top of the page.
      this.windowRef.nativeWindow.scroll(0, 0);
    }
  }

  private isExternal(route: any): boolean {
    let path = route.path;

    if (typeof path !== 'string') {
      return false;
    }
    return /^(https?|mailto|ftp):+|^(www)/.test(path);
  }
}
