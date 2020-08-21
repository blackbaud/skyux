import {
  Directive
} from '@angular/core';

/**
 * This is the description for FooComplexDirective.
 */
@Directive({
  selector: `input[fooComplex],
             textarea[fooComplex],
             [required][fooComplex]`
})
export class FooComplexDirective { }
