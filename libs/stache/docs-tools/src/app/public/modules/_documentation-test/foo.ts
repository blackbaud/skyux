import {
  FooUser
} from './foo-user';

/**
 * This is the description for Foo interface.
 */
export interface Foo<T, U extends FooUser> {

  user: FooUser;

  /**
   * This is the description for bar.
   */
  bar: T;

  /**
   * This is the description for baz.
   */
  baz?: U;

  /**
   * Allow any other properties.
   */
  [_: string]: any;
}
