import {
  EventEmitter
} from '@angular/core';

import {
  Foo
} from './foo';

import {
  FooUser
} from './foo-user';

export interface FooInitArgs {
  /**
   * The foo of the init.
   */
  foo: FooUser;
  /**
   * The string of the init.
   */
  bar: string;
}

/**
 * This is the description for FooClass.
 */
export class FooClass {

  public get foo(): number {
    return this._foo || 10;
  }

  /**
   * The foo of the FooClass.
   * @default 10
   */
  public set foo(value: number) {
    this._foo = value;
  }

  /**
   * This is the description for `publicProperty`.
   */
  public publicProperty: string = 'foobar';

  public unionType: FooUser | string;

  public unionTypeEventEmitter: EventEmitter<FooUser | string>;

  public stringLiteral = 'foobar';

  private _foo: number;

  /**
   * This is the description for `getValue()`.
   */
  public getValue(): string {
    return 'Hello, World.';
  }

  public getEmail(locale: string = 'en-US'): string {
    return 'email@domain.com';
  }

  /**
   * This is the init function.
   * @param args The init args.
   * - `args.foo` This defaults to 'bar'.
   */
  public init(args: FooInitArgs): void { }

  public getUser<T>(): T {
    return {} as T;
  }

  public setUser<T, U extends FooUser>(user: Foo<T, U>): void {}

}
