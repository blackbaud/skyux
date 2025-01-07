import { LocationStrategy } from '@angular/common';
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
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLink]',
  standalone: false,
})
export class SkyAppLinkDirective extends RouterLink implements OnChanges {
  @Input()
  public set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  #skyAppConfig: SkyAppConfig | undefined;
  #paramsProvider: SkyAppRuntimeConfigParamsProvider | undefined;

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    renderer: Renderer2,
    elementRef: ElementRef,
    @Optional() skyAppConfig?: SkyAppConfig,
    @Optional() paramsProvider?: SkyAppRuntimeConfigParamsProvider,
  ) {
    super(router, route, undefined, renderer, elementRef, locationStrategy);
    this.#skyAppConfig = skyAppConfig;
    this.#paramsProvider = paramsProvider;
  }

  public override ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.#mergeQueryParams(
      changes['queryParams']?.currentValue,
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
