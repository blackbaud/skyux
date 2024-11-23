/* eslint-disable @typescript-eslint/no-unused-vars */
import { FooClass } from './foo.class';

/**
 * This describes the createFoo function.
 * @param param1 This describes param1.
 * @param param2 This describes param2.
 * @param param3 This describes param3.
 */
export function createFoo<T extends string>(
  param1: T,
  param2 = false,
  param3?: number,
): FooClass<T> {
  return new FooClass<T>();
}
