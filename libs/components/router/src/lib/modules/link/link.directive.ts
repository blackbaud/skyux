import { LocationStrategy } from '@angular/common';
import {
  Directive,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLink]',
})
export class SkyAppLinkDirective
  extends RouterLinkWithHref
  implements OnChanges
{
  @Input()
  set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  #skyAppConfig: SkyAppConfig | undefined;
  #paramsProvider: SkyAppRuntimeConfigParamsProvider | undefined;

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    @Optional() skyAppConfig?: SkyAppConfig,
    @Optional() paramsProvider?: SkyAppRuntimeConfigParamsProvider
  ) {
    super(router, route, locationStrategy);
    this.#skyAppConfig = skyAppConfig;
    this.#paramsProvider = paramsProvider;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.#mergeQueryParams(
      changes.queryParams?.currentValue
    );
    super.ngOnChanges(changes);
  }

  #mergeQueryParams(queryParams: SkyAppLinkQueryParams): SkyAppLinkQueryParams {
    const skyuxParams = this.#skyAppConfig
      ? this.#skyAppConfig.runtime.params.getAll(true)
      : this.#paramsProvider?.params.getAll(true);

    return Object.assign({}, this.queryParams, queryParams, skyuxParams);
  }
}
