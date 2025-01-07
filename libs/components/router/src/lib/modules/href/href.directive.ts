import {
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyHrefResolverService } from './href-resolver.service';
import { SkyHref } from './types/href';
import { SkyHrefChange } from './types/href-change';
import { SkyHrefQueryParams } from './types/href-query-params';

interface HrefChanges {
  href: string;
  hidden: boolean;
}

@Directive({
  selector: '[skyHref]',
  standalone: false,
})
export class SkyHrefDirective {
  /**
   * Provide a link as a string or as an array of strings to be joined by a slash to form a complete
   * URL.
   *
   * @param skyHref
   */
  @Input()
  public set skyHref(skyHref: string | string[] | undefined) {
    if (typeof skyHref === 'string') {
      this.#_skyHref = skyHref;
    } else {
      this.#_skyHref = skyHref ? skyHref.join('/') : '';
    }

    void this.#checkRouteAccess();
  }

  public get skyHref(): string {
    return this.#_skyHref;
  }

  /**
   * A collection of query URL parameters.
   */
  @Input()
  public set queryParams(value: SkyHrefQueryParams | undefined) {
    if (value !== this.#_queryParams) {
      this.#_queryParams = value;
      this.#applyChanges(this.#getChanges());
    }
  }

  public get queryParams(): SkyHrefQueryParams | undefined {
    return this.#_queryParams;
  }

  /**
   * Set the behavior for when the link is not available to either hide the link or display unlinked text.
   *
   * @param value
   */
  @Input()
  public set skyHrefElse(value: 'hide' | 'unlink' | undefined) {
    this.#_skyHrefElse = value;
    this.#applyChanges(this.#getChanges());
  }

  public get skyHrefElse(): 'hide' | 'unlink' | undefined {
    return this.#_skyHrefElse;
  }

  /**
   * Emits whether the link is available (true) or not (false).
   */
  @Output()
  public skyHrefChange = new EventEmitter<SkyHrefChange>();

  #route: SkyHref | false = false;

  #href = '';

  #_queryParams: SkyHrefQueryParams | undefined;
  #_skyHref = '';
  #_skyHrefElse: 'hide' | 'unlink' | undefined = 'hide';

  #router: Router;
  #renderer: Renderer2;
  #element: ElementRef;
  #skyAppConfig: SkyAppConfig | undefined;
  #paramsProvider: SkyAppRuntimeConfigParamsProvider | undefined;
  #hrefResolver: SkyHrefResolverService | undefined;
  #applicationRef: ApplicationRef | undefined;
  #changeDetectorRef: ChangeDetectorRef | undefined;

  constructor(
    router: Router,
    renderer: Renderer2,
    element: ElementRef,
    @Optional() skyAppConfig?: SkyAppConfig,
    @Optional() paramsProvider?: SkyAppRuntimeConfigParamsProvider,
    @Optional() hrefResolver?: SkyHrefResolverService,
    @Optional() applicationRef?: ApplicationRef,
    @Optional() changeDetectorRef?: ChangeDetectorRef,
  ) {
    this.#router = router;
    this.#renderer = renderer;
    this.#element = element;
    this.#skyAppConfig = skyAppConfig;
    this.#paramsProvider = paramsProvider;
    this.#hrefResolver = hrefResolver;
    this.#applicationRef = applicationRef;
    this.#changeDetectorRef = changeDetectorRef;
  }

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
    metaKey: boolean,
  ): boolean {
    if (!this.#route || !this.#route.userHasAccess) {
      return false;
    }

    if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
      return true;
    }

    const target = this.#element.nativeElement.getAttribute('target');
    if (typeof target === 'string' && target !== '_self') {
      return true;
    }

    const urlTree = this.#getUrlTree();
    if (urlTree) {
      void this.#router.navigateByUrl(urlTree);
      return false;
    }
    return true;
  }

  #applyChanges(change: HrefChanges): void {
    this.#renderer.addClass(this.#element.nativeElement, 'sky-href');
    if (change.hidden) {
      this.#renderer.setAttribute(
        this.#element.nativeElement,
        'hidden',
        'hidden',
      );
    } else {
      this.#renderer.removeAttribute(this.#element.nativeElement, 'hidden');
    }
    if (change.href) {
      this.#renderer.setAttribute(
        this.#element.nativeElement,
        'href',
        change.href,
      );
    } else {
      this.#renderer.removeAttribute(this.#element.nativeElement, 'href');
    }
    this.skyHrefChange.emit({ userHasAccess: !change.hidden });
  }

  async #checkRouteAccess(): Promise<void> {
    this.#route = {
      url: this.skyHref,
      userHasAccess: false,
    };
    /* istanbul ignore else */
    if (this.#hrefResolver && this.skyHref) {
      this.#applyChanges(this.#getChanges());
      try {
        const route = await this.#hrefResolver.resolveHref({
          url: this.skyHref,
        });

        this.#route = { ...route };
        this.#applyChanges(this.#getChanges());

        /* istanbul ignore else */
        if (this.#changeDetectorRef && this.#applicationRef) {
          this.#changeDetectorRef.markForCheck();
          this.#applicationRef.tick();
        }
      } catch {
        this.#applyChanges(this.#getChanges());
      }
    } else {
      // no resolver or skyHref is falsy
      this.#route.userHasAccess = !!this.skyHref;
      this.#applyChanges(this.#getChanges());
    }
  }

  #getChanges(): HrefChanges {
    if (!this.#route || !this.#route.userHasAccess) {
      return {
        href: '',
        hidden: this.skyHrefElse === 'hide',
      };
    } else {
      const params =
        // The SkyAppRuntimeParamsProvider is provided in root, so it will never be undefined.
        // TODO: rework the injectors so that #paramsProvider is not possibly undefined.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#skyAppConfig?.runtime.params ?? this.#paramsProvider!.params;

      this.#href = params.getLinkUrl(this.#route.url, {
        queryParams: this.queryParams ?? {},
      });

      return {
        href: this.#href,
        hidden: false,
      };
    }
  }

  /* istanbul ignore next */
  #getUrlTree: () => UrlTree | false = () => {
    const href = this.#href.toLowerCase();

    if (
      !href ||
      !this.#skyAppConfig?.skyux.host?.url ||
      !this.#skyAppConfig?.runtime?.app?.base
    ) {
      return false;
    }

    const baseUrl = (
      this.#skyAppConfig.skyux.host.url +
      this.#skyAppConfig.runtime.app.base.substr(
        0,
        this.#skyAppConfig.runtime.app.base.length - 1,
      )
    ).toLowerCase();

    if (
      href === baseUrl ||
      // Make sure the base URL is not simply a partial match of the base URL plus additional
      // characters after the base URL that are not "terminating" characters
      href.indexOf(baseUrl + '/') === 0 ||
      href.indexOf(baseUrl + '?') === 0
    ) {
      const routePath = this.#href.substring(baseUrl.length);
      return this.#router.parseUrl(routePath);
    }

    return false;
  };
}
