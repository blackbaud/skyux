import { Directive } from '@angular/core';

/**
 * @internal
 */
@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'input:not([skyId]):not(.sky-form-control),select:not([skyId]):not(.sky-form-control),textarea:not([skyId]):not(.sky-form-control)',
  standalone: true,
})
export class SkyInputBoxControlDirective {}
