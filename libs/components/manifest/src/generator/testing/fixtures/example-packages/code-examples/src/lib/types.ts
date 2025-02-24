import { Component } from '@angular/core';

/**
 * @title This is a title
 */
@Component({
  selector: 'foo-example-1',
})
export class FooCodeExample1 {}

export interface FooCodeExampleInterface {
  /**
   * This describes the foo string.
   */
  foo: string;
}
