import { Location } from '@angular/common';

import { Injectable, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, SubscriptionLike } from 'rxjs';

/**
 * @internal
 */
interface PermalinkParams {
  [_: string]: string;
}

/**
 * @internal
 */
@Injectable()
export class SkyTabsetPermalinkService implements OnDestroy {
  public get popStateChange(): Observable<void> {
    return this._popStateChange.asObservable();
  }

  private _popStateChange = new Subject<void>();

  private subscription: SubscriptionLike;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public init(): void {
    this.subscription = this.location.subscribe(() => {
      this._popStateChange.next();
    });
  }

  /**
   * Returns the value of a URL query param.
   */
  public getParam(name: string): string {
    return this.getParams()[name];
  }

  /**
   * Sets the value of a URL query param.
   */
  public setParam(name: string, value: string | null): void {
    const params = this.getParams();

    if (value === null) {
      delete params[name];
    } else {
      params[name] = value;
    }

    // Update the URL without triggering a navigation state change.
    // See: https://stackoverflow.com/a/46486677
    const url = this.router
      .createUrlTree(['.'], {
        relativeTo: this.activatedRoute,
        queryParams: params,
        queryParamsHandling: 'merge',
      })
      .toString();

    // Abort redirect if the current URL is equal to the new URL.
    if (this.location.isCurrentPathEqualTo(url)) {
      return;
    }

    this.location.go(url);
  }

  /**
   * Removes the provided query param from the URL.
   */
  public clearParam(name: string): void {
    /*tslint:disable-next-line:no-null-keyword*/
    this.setParam(name, null);
  }

  /**
   * Returns a relative URL that includes the provided query parameter. The value is inteded to be
   * used by an HTML anchor element.
   */
  public getParamHref(name: string, value: string): string | null {
    if (!name) {
      /*tslint:disable-next-line:no-null-keyword*/
      return null;
    }

    const params = this.getParams();
    params[name] = value;

    const baseUrl = this.location.path().split('?')[0];
    const paramString = Object.keys(params)
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    return this.location.prepareExternalUrl(`${baseUrl}?${paramString}`);
  }

  /**
   * Converts the provided string into a value that can be safely used in a URL.
   */
  public urlify(value: string): string {
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
  private getParams(): PermalinkParams {
    const params: PermalinkParams = {};

    const path = this.location.path();
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
