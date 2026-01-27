import { Directive, HostBinding, Input, inject } from '@angular/core';

import { SkyInputBoxHostService } from './input-box-host.service';

/**
 * @internal
 */
@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'input:not([skyId]):not(.sky-form-control),select:not([skyId]):not(.sky-form-control),textarea:not([skyId]):not(.sky-form-control)',
})
export class SkyInputBoxControlDirective {
  @HostBinding('autocomplete')
  @Input()
  public set autocomplete(value: string | undefined) {
    this.#_autocomplete = value;
  }

  public get autocomplete(): string | undefined {
    return this.#_autocomplete || (this.#hostSvc ? 'off' : undefined);
  }

  #_autocomplete: string | undefined;
  #hostSvc = inject(SkyInputBoxHostService, { optional: true });
}
