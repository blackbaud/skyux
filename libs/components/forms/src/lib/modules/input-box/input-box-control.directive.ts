import { inject } from '@angular/core';
import { Directive, HostBinding, Input } from '@angular/core';

import { SkyInputBoxHostService } from './input-box-host.service';

/**
 * @internal
 */
@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'input:not([skyId]):not(.sky-form-control),select:not([skyId]):not(.sky-form-control),textarea:not([skyId]):not(.sky-form-control)',
  standalone: true,
})
export class SkyInputBoxControlDirective {
  @HostBinding('autocomplete')
  @Input()
  public set autocomplete(value: string | undefined) {
    this.#_autocomplete = value;
    if (!value && this.#hostService) {
      this.#_autocomplete = 'off';
    }
  }

  public get autocomplete(): string | undefined {
    return this.#_autocomplete;
  }

  #_autocomplete: string | undefined;
  #hostService = inject(SkyInputBoxHostService, { optional: true });
}
