import { Location } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

  #popStateChange = new Subject<void>();

  #subscription: SubscriptionLike | undefined;

  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #router = inject(Router);

  public ngOnDestroy(): void {
    this.#subscription?.unsubscribe();
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
    const params: Params = this.#getParams();
    params[name] = value ?? undefined;

    // Uses merge so other query params are not lost. Deleted query params
    // are set to `undefined` so they are removed from the URL.
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

    // Navigate via the Angular router to update the URL and broadcast the
    // change. Use `replaceUrl` on the initial navigation so an extra history
    // item isn't added to the browser's back stack.
    void this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: initial,
    });
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
