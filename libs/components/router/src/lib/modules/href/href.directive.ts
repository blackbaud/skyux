import { HttpParams } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Optional,
  Renderer2,
} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyHrefQueryParams } from './href-query-params';
import { SkyHrefResolverService } from './href-resolver.service';

import { SkyHref } from './types/href';

type HrefChanges = { href: string; hidden: boolean };

@Directive({
  selector: '[skyHref]',
})
export class SkyHrefDirective {
  /**
   * Provide a link as a string or as an array of strings to be joined by a slash to form a complete
   * URL.
   *
   * @param skyHref
   */
  @Input()
  public set skyHref(skyHref: string | string[]) {
    if (typeof skyHref === 'string') {
      this._skyHref = skyHref;
    } else {
      this._skyHref = skyHref.join('/');
    }

    this.checkRouteAccess();
  }

  @Input()
  public set skyHrefElse(value: 'hide' | 'unlink') {
    this._skyHrefElse = value;
    this.applyChanges(this.getChanges());
  }

  private _route: SkyHref | false = false;

  private _href: string;

  private _skyHref = '';

  private _skyHrefElse: 'hide' | 'unlink' = 'hide';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef,
    @Optional() private skyAppConfig?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider,
    @Optional() private hrefResolver?: SkyHrefResolverService
  ) {}

  /* istanbul ignore next */
  @HostListener('click', [
    '$event.button',
    '$event.ctrlKey',
    '$event.shiftKey',
    '$event.altKey',
    '$event.metaKey',
  ])
  public onClick(
    button: number,
    ctrlKey: boolean,
    shiftKey: boolean,
    altKey: boolean,
    metaKey: boolean
  ): boolean {
    if (!this._route || !this._route.userHasAccess) {
      return false;
    }

    if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
      return true;
    }

    const target = this.element.nativeElement.getAttribute('target');
    if (typeof target === 'string' && target !== '_self') {
      return true;
    }

    const urlTree = this.getUrlTree();
    if (urlTree) {
      this.router.navigateByUrl(urlTree);
      return false;
    }
    return true;
  }

  private applyChanges(change: HrefChanges) {
    this.renderer.addClass(this.element.nativeElement, 'sky-href');
    if (change.hidden) {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'hidden',
        'hidden'
      );
    } else {
      this.renderer.removeAttribute(this.element.nativeElement, 'hidden');
    }
    if (change.href) {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'href',
        change.href
      );
    } else {
      this.renderer.removeAttribute(this.element.nativeElement, 'href');
    }
  }

  private checkRouteAccess() {
    this._route = {
      url: this._skyHref,
      userHasAccess: false,
    };
    /* istanbul ignore else */
    if (this.hrefResolver && this._skyHref) {
      this.applyChanges(this.getChanges());
      try {
        this.hrefResolver.resolveHref({ url: this._skyHref }).then((route) => {
          this._route = { ...route };
          this.applyChanges(this.getChanges());
        });
      } catch (error) {
        this.applyChanges(this.getChanges());
      }
    } else {
      // no resolver or skyHref is falsy
      this._route.userHasAccess = !!this._skyHref;
      this.applyChanges(this.getChanges());
    }
  }

  private getChanges(): HrefChanges {
    const queryParams: SkyHrefQueryParams = {};

    if (!this._route || !this._route.userHasAccess) {
      return {
        href: '',
        hidden: this._skyHrefElse === 'hide',
      };
    } else {
      const [beforeFragment, fragment] = this._route.url.split('#', 2);
      const [baseUrl, search] = beforeFragment.split('?', 2);

      if (search) {
        const searchParams = new HttpParams({ fromString: search });
        searchParams.keys().forEach((key) => {
          queryParams[key] = searchParams.get(key);
        });
      }

      const queryParamsMerged = new HttpParams({
        fromObject: Object.assign({}, this.getSkyuxParams(), queryParams),
      });

      this._href =
        baseUrl +
        (queryParamsMerged.keys().length > 0
          ? '?' + queryParamsMerged.toString()
          : '') +
        (fragment ? `#${fragment}` : '');
      return {
        href: this._href,
        hidden: false,
      };
    }
  }

  private getSkyuxParams(): SkyHrefQueryParams {
    return typeof this.skyAppConfig?.runtime.params?.getAll === 'function'
      ? this.skyAppConfig.runtime.params.getAll(true)
      : this.paramsProvider.params.getAll(true);
  }

  /* istanbul ignore next */
  private getUrlTree(): UrlTree | false {
    const href = this._href.toLowerCase();

    if (
      !href ||
      !this.skyAppConfig?.skyux.host?.url ||
      !this.skyAppConfig?.runtime?.app?.base
    ) {
      return false;
    }

    const baseUrl = (
      this.skyAppConfig.skyux.host.url +
      this.skyAppConfig.runtime.app.base.substr(
        0,
        this.skyAppConfig.runtime.app.base.length - 1
      )
    ).toLowerCase();

    if (
      href === baseUrl ||
      // Make sure the base URL is not simply a partial match of the base URL plus additional
      // characters after the base URL that are not "terminating" characters
      href.indexOf(baseUrl + '/') === 0 ||
      href.indexOf(baseUrl + '?') === 0
    ) {
      const routePath = this._href.substring(baseUrl.length);
      return this.router.parseUrl(routePath);
    }

    return false;
  }
}
