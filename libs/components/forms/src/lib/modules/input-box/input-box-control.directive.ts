import { Directive } from '@angular/core';

/**
 * @internal
 */
@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'input:not([skyId]),select:not([skyId]),textarea:not([skyId])',
  standalone: true,
})
export class SkyInputBoxControlDirective {}
