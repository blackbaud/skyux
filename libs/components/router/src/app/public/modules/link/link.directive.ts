import {
  Directive,
  Input
} from '@angular/core';

import {
  LocationStrategy
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLinkWithHref
} from '@angular/router';

import {
  SkyAppConfig
} from '@skyux/config';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLink]'
})
export class SkyAppLinkDirective extends RouterLinkWithHref {
  private _queryParams: SkyAppLinkQueryParams;

  @Input()
  set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  @Input()
  set queryParams(params: { [k: string]: any }) {
    this._queryParams = Object.assign(params, this.skyAppConfig.runtime.params.getAll(true));
  }

  get queryParams(): SkyAppLinkQueryParams {
    if (!this._queryParams) {
      this._queryParams = Object.assign({}, this.skyAppConfig.runtime.params.getAll(true));
    }
    return this._queryParams;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    private skyAppConfig: SkyAppConfig
  ) {
    super(router, route, locationStrategy);
  }
}
