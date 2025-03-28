import { BarBaseInterface } from '../../../bar/src/index';

/**
 * This is the Foo interface.
 */
export interface FooInterface<A, B> {
  bar?: A;
  /**
   * This describes baz.
   */
  baz: B;
  /**
   * This describes the index signature.
   * @param _ The name of the thing.
   */
  [_: string]: unknown;
}

// eslint-disable-next-line
export interface FooEmptyInterface {}

// eslint-disable-next-line
export interface FooEmptyExtendedInterface extends BarBaseInterface {}
