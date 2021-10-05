import {
  Directive,
  Input,
  OnChanges,
  Optional,
  SimpleChanges
} from '@angular/core';

import {
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLinkWithHref
} from '@angular/router';

import {
  SkyAppConfig,
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import { SkyAppLinkQueryParams } from './link-query-params';

/**
 * @deprecated Use `skyHref` directive instead.
 */
@Directive({
  selector: '[skyAppLinkExternal]'
})
export class SkyAppLinkExternalDirective extends RouterLinkWithHref implements OnChanges {

  @Input()
  set skyAppLinkExternal(commands: any[] | string) {
    this.routerLink = commands;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    platformLocation: PlatformLocation,
    private window: SkyAppWindowRef,
    @Optional() private skyAppConfig?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider,
    @Optional() hostConfig?: SkyAppConfigHost
  ) {
    super(
      router,
      route,
      new PathLocationStrategy(
        platformLocation,
        (hostConfig)
          ? hostConfig.host.url
          : skyAppConfig.skyux.host.url
      )
    );

    if (this.window.nativeWindow.window.name && this.window.nativeWindow.window.name !== '') {
      this.target = this.window.nativeWindow.window.name;
    } else {
      this.target = '_top';
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.mergeQueryParams(changes.queryParams?.currentValue);
    super.ngOnChanges(changes);
  }

  private mergeQueryParams(queryParams: SkyAppLinkQueryParams): SkyAppLinkQueryParams {
    const skyuxParams = (this.skyAppConfig)
      ? this.skyAppConfig.runtime.params.getAll()
      : this.paramsProvider.params.getAll();

    return Object.assign(
      {},
      this.queryParams,
      queryParams,
      skyuxParams
    );
  }
}
