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
   * Gets a user from the database.
   * @param id The unique identifier.
   * @param locale The locale of the user.
   * @required
   */
  getUser: (id: FooUser, locale?: string) => FooUser;

  getUsers?: () => void;

  /**
   * Specifies a function to call when users select the text field or button.
   * @param user A `FooUser` object that provides values to the custom picker.
   * @param updateValue A function that accepts an array of `FooUser` objects that
   * represent the values selected in the custom picker.
   */
  open: (
    user: FooUser,
    updateValue: (value: FooUser[]) => void
  ) => void;

  /**
   * This is the description for baz.
   */
  baz?: U;

  /**
   * Allow any other properties.
   */
  [_: string]: any;
}
