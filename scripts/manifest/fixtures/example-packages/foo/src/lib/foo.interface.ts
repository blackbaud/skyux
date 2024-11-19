/**
 * This is the Foo interface.
 * @docsSection banana
 */
export interface FooInterface {
  bar?: string;
  /**
   * This describes baz.
   */
  baz: string;
  /**
   * This describes the index signature.
   * @param _ The name of the thing.
   */
  [_: string]: unknown;
}
