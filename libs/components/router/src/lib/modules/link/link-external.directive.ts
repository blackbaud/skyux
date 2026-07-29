import { PathLocationStrategy, PlatformLocation } from '@angular/common';
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

  readonly #window = inject(SkyAppWindowRef);
  readonly #skyAppConfig: SkyAppConfig | null;
  readonly #paramsProvider = inject(SkyAppRuntimeConfigParamsProvider, {
    optional: true,
  });

  constructor() {
    const skyAppConfig = inject(SkyAppConfig, { optional: true });
    const hostConfig = inject(SkyAppConfigHost, { optional: true });

    super(
      inject(Router),
      inject(ActivatedRoute),
      undefined,
      inject(Renderer2),
      inject(ElementRef),
      new PathLocationStrategy(
        inject(PlatformLocation),
        hostConfig ? hostConfig.host.url : skyAppConfig?.skyux.host?.url,
      ),
    );
    this.#skyAppConfig = skyAppConfig;

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
