import {
  Directive,
  Input,
  OnChanges,
  Optional,
  SimpleChanges
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
  SkyAppConfig,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLink]'
})
export class SkyAppLinkDirective extends RouterLinkWithHref implements OnChanges {

  @Input()
  set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    @Optional() private skyAppConfig?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider
  ) {
    super(router, route, locationStrategy);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.mergeQueryParams(changes.queryParams?.currentValue);
    super.ngOnChanges(changes);
  }

  private mergeQueryParams(queryParams: SkyAppLinkQueryParams): SkyAppLinkQueryParams {
    const skyuxParams = (this.skyAppConfig)
      ? this.skyAppConfig.runtime.params.getAll(true)
      : this.paramsProvider.params.getAll(true);

    return Object.assign(
      {},
      this.queryParams,
      queryParams,
      skyuxParams
    );
  }

}
