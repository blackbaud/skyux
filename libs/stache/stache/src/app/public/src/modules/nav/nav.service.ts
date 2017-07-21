import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StacheWindowRef } from '../shared';

@Injectable()
export class StacheNavService {
  public constructor(
    private router: Router,
    private windowRef: StacheWindowRef) { }

  public navigate(route: any): void {
    let extras: any = {};
    const currentPath = this.router.url.split('#')[0].substring(1);
    if (this.isExternal(route)) {
      this.windowRef.nativeWindow.location.href = route.path;
      return;
    }

    if (route.fragment) {
      const element = this.windowRef.nativeWindow.document.getElementById(route.fragment);

      if (element) {
        this.scrollToElement(element, route.fragment);
        return;
      }

      // The current page is the path intended, but no element with the fragment exists, scroll to
      // the top of the page.
      if (route.path === currentPath) {
        this.windowRef.nativeWindow.scroll(0, 0);
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

  private scrollToElement(element: any, fragment: string) {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.windowRef.nativeWindow.location.hash = fragment;
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
