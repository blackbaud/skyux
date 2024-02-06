import { Location } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, SubscriptionLike } from 'rxjs';

/**
 * @internal
 */
type PermalinkParams = Record<string, string>;

/**
 * @internal
 */
@Injectable()
export class SkyTabsetPermalinkService implements OnDestroy {
  public get popStateChange(): Observable<void> {
    return this.#popStateChange;
  }

  #popStateChange: Subject<void>;

  #subscription: SubscriptionLike | undefined;

  #activatedRoute: ActivatedRoute;
  #location: Location;
  #router: Router;

  constructor(
    activatedRoute: ActivatedRoute,
    location: Location,
    router: Router,
  ) {
    this.#activatedRoute = activatedRoute;
    this.#location = location;
    this.#router = router;

    this.#popStateChange = new Subject<void>();
  }

  public ngOnDestroy(): void {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
    this.#popStateChange.complete();
  }

  public init(): void {
    this.#subscription = this.#location.subscribe(() => {
      this.#popStateChange.next();
    });
  }

  /**
   * Returns the value of a URL query param.
   */
  public getParam(name: string): string {
    return this.#getParams()[name];
  }

  /**
   * Sets the value of a URL query param.
   */
  public setParam(name: string, value: string | null, initial?: boolean): void {
    const params = this.#getParams();

    if (value === null) {
      delete params[name];
    } else {
      params[name] = value;
    }

    // Update the URL without triggering a navigation state change.
    // See: https://stackoverflow.com/a/46486677
    const url = this.#router
      .createUrlTree([], {
        relativeTo: this.#activatedRoute,
        queryParams: params,
        queryParamsHandling: 'merge',
      })
      .toString();

    // Abort redirect if the current URL is equal to the new URL.
    if (this.#location.isCurrentPathEqualTo(url)) {
      return;
    }

    // Use `replaceState()` when the tabset is being initialized so an extra
    // history item isn't added to the browser's back stack.
    this.#location[initial ? 'replaceState' : 'go'](url);
  }

  /**
   * Removes the provided query param from the URL.
   */
  public clearParam(name: string): void {
    // Don't overwrite the URL while the Angular router is in the process
    // of navigating (e.g. when the tabset is destroyed due to navigating
    // away from the current page).
    if (!this.#router.getCurrentNavigation()) {
      this.setParam(name, null);
    }
  }

  /**
   * Returns a relative URL that includes the provided query parameter. The value is intended to be
   * used by an HTML anchor element.
   */
  public getParamHref(name: string | undefined, value: string): string | null {
    if (!name) {
      return null;
    }

    const params = this.#getParams();
    params[name] = value;

    const baseUrl = this.#location.path().split('?')[0];
    const paramString = Object.keys(params)
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    return this.#location.prepareExternalUrl(`${baseUrl}?${paramString}`);
  }

  /**
   * Converts the provided string into a value that can be safely used in a URL.
   */
  public urlify(value: string | undefined): string {
    if (!value) {
      return '';
    }

    const sanitized = value
      .toLowerCase()

      // Remove special characters.
      .replace(/[_~`@!#$%^&*()[\]{};:'/\\<>,.?=+|"]/g, '')

      // Replace space characters with a dash.
      .replace(/\s/g, '-')

      // Remove any double-dashes.
      .replace(/--/g, '-');

    return sanitized;
  }

  /**
   * Returns all query params that exist in the current URL.
   */
  #getParams(): PermalinkParams {
    const params: PermalinkParams = {};

    const path = this.#location.path();
    if (path.indexOf('?') === -1) {
      return params;
    }

    const existingParamPairs = path.split('?')[1].split('&');
    existingParamPairs.forEach((pair) => {
      const fragments = pair.split('=');
      params[fragments[0]] = decodeURIComponent(fragments[1]);
    });

    return params;
  }
}
