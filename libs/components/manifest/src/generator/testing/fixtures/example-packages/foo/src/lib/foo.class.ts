/**
 * This is the foo class.
 */
export class FooClass {
  public bar = 'baz';
  /**
   * This describes baz.
   * @default 'foo'
   */
  public baz: string | undefined;

  public somethingElse: undefined | (() => void);
}
