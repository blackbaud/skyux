import { LocationStrategy } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  inject,
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

  readonly #skyAppConfig = inject(SkyAppConfig, { optional: true });
  readonly #paramsProvider = inject(SkyAppRuntimeConfigParamsProvider, {
    optional: true,
  });

  constructor() {
    super(
      inject(Router),
      inject(ActivatedRoute),
      undefined,
      inject(Renderer2),
      inject(ElementRef),
      inject(LocationStrategy),
    );
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
