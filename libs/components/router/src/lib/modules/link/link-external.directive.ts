import { PathLocationStrategy, PlatformLocation } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  SkyAppConfig,
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider,
} from '@skyux/config';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyAppLinkQueryParams } from './link-query-params';

/**
 * @deprecated Use `skyHref` directive instead.
 */
@Directive({
  selector: '[skyAppLinkExternal]',
  standalone: false,
})
export class SkyAppLinkExternalDirective
  extends RouterLink
  implements OnChanges
{
  @Input()
  public set skyAppLinkExternal(commands: any[] | string) {
    this.routerLink = commands;
  }

  #window: SkyAppWindowRef;
  #skyAppConfig: SkyAppConfig | undefined;
  #paramsProvider: SkyAppRuntimeConfigParamsProvider | undefined;

  constructor(
    router: Router,
    route: ActivatedRoute,
    renderer: Renderer2,
    elementRef: ElementRef,
    platformLocation: PlatformLocation,
    window: SkyAppWindowRef,
    @Optional() skyAppConfig?: SkyAppConfig,
    @Optional() paramsProvider?: SkyAppRuntimeConfigParamsProvider,
    @Optional() hostConfig?: SkyAppConfigHost,
  ) {
    super(
      router,
      route,
      undefined,
      renderer,
      elementRef,
      new PathLocationStrategy(
        platformLocation,
        hostConfig ? hostConfig.host.url : skyAppConfig?.skyux.host?.url,
      ),
    );
    this.#window = window;
    this.#skyAppConfig = skyAppConfig;
    this.#paramsProvider = paramsProvider;

    if (
      this.#window.nativeWindow.window.name &&
      this.#window.nativeWindow.window.name !== ''
    ) {
      this.target = this.#window.nativeWindow.window.name;
    } else {
      this.target = '_top';
    }
  }

  public override ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.#mergeQueryParams(
      changes['queryParams']?.currentValue,
    );
    super.ngOnChanges(changes);
  }

  #mergeQueryParams(queryParams: SkyAppLinkQueryParams): SkyAppLinkQueryParams {
    const skyuxParams = this.#skyAppConfig
      ? this.#skyAppConfig.runtime.params.getAll()
      : this.#paramsProvider?.params.getAll();

    return Object.assign({}, this.queryParams, queryParams, skyuxParams);
  }
}
