import {
  Injectable,
  OnDestroy
} from '@angular/core';

/**
 * This is the description for FooService.
 */
@Injectable()
export class FooService implements OnDestroy {

  /**
   * This is the description for FOOS.
   */
  public FOOS: string[] = [];

  /**
   * This is the description for createFoo().
   */
  public createFoo(bar: string, baz?: string, lorem: string = 'ipsum'): string[] {
    this.FOOS.push(`${bar}${baz}${lorem}`);
    return this.FOOS;
  }

  /**
   * This is the description for anotherFoo().
   */
  public anotherFoo(): void {}

  public ngOnDestroy(): void {}
}
