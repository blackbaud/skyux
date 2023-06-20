import { Directive } from '@angular/core';

@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'input:not([skyId]),textarea:not([skyId])',
  standalone: true,
})
export class SkyInputBoxControlDirective {}
