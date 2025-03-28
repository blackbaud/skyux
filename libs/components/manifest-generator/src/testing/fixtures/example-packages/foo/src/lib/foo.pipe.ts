import { Pipe, PipeTransform } from '@angular/core';

/**
 * This describes the Foo pipe.
 */
@Pipe({
  name: 'foo',
})
export class FooPipe implements PipeTransform {
  /**
   * This describes the transform method.
   * @param value
   * @param isThing
   * @param bar
   * @param foo
   * @returns
   */
  public transform(
    value: string | undefined,
    isThing = false,
    bar: boolean,
    foo?: string,
  ): string {
    return (value ?? isThing) ? 'thing' : foo ? bar.toString() : 'not a thing';
  }
}
