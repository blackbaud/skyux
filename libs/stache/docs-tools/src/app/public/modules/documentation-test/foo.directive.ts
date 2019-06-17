import {
  Directive,
  Input
} from '@angular/core';

/**
 * This is the description for FooDirective.
 */
@Directive({
  selector: '[foo]'
})
export class FooDirective {

  @Input()
  public fooOptions: any;

}
