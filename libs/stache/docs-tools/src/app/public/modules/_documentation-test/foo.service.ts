import {
  Injectable,
  OnDestroy,
  Type
} from '@angular/core';

import {
  FooUser
} from './foo-user';

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
   * This is the description for getFoos call signature.
   */
  public getFoos: () => string[];

  /**
   * This is the description for createFoo().
   * @example
   * ```typescript
   * const instance = this.fooService.createFoo('baz');
   * ```
   */
  public createFoo(bar: string, baz?: string, lorem: string = 'ipsum'): string[] {
    this.FOOS.push(`${bar}${baz}${lorem}`);
    return this.FOOS;
  }

  /**
   * This is the description for anotherFoo().
   * @param component The component to create.
   * @param user The user to use.
   * @deprecated Please use `createFoo` input on the [[FooComponent]] instead.
   */
  public anotherFoo<T, U extends FooUser>(component: Type<T>, user: U): void {}

  public ngOnDestroy(): void {}
}
