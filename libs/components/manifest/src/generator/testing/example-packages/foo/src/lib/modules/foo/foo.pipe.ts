import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foo',
})
export class FooPipe implements PipeTransform {
  public transform(
    value: string | undefined,
    isThing = false,
    foo: string,
    bar?: string,
  ): string {
    return (value ?? isThing) ? 'thing' : foo;
  }
}
