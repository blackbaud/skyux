import {
  Directive,
  Input
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
  SkyAppConfig
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLinkExternal]'
})
export class SkyAppLinkExternalDirective extends RouterLinkWithHref {

  private _queryParams: SkyAppLinkQueryParams;

  @Input()
  set skyAppLinkExternal(commands: any[] | string) {
    this.routerLink = commands;
  }

  @Input()
  set queryParams(params: SkyAppLinkQueryParams) {
    this._queryParams = Object.assign(params, this.skyAppConfig.runtime.params.getAll());
  }

  get queryParams(): SkyAppLinkQueryParams {
    if (!this._queryParams) {
      this._queryParams = Object.assign({}, this.skyAppConfig.runtime.params.getAll());
    }
    return this._queryParams;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    platformLocation: PlatformLocation,
    private skyAppConfig: SkyAppConfig,
    private window: SkyAppWindowRef
  ) {
    super(router, route, new PathLocationStrategy(platformLocation, skyAppConfig.skyux.host.url));
    if (this.window.nativeWindow.window.name && this.window.nativeWindow.window.name !== '') {
      this.target = this.window.nativeWindow.window.name;
    } else {
      this.target = '_top';
    }
  }
}
