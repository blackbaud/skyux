import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foo',
})
export class FooPipe implements PipeTransform {
  public transform(
    value: string | undefined,
    isThing = false,
    bar: boolean,
    foo?: string,
  ): string {
    return (value ?? isThing) ? 'thing' : foo ? bar.toString() : 'not a thing';
  }
}
