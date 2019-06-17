import {
  FooDate
} from './foo-date';

/**
 * This is the description for FooTypeUnionComplex. It can be of type [FooDate](https://google.com).
 */
export type FooTypeUnionComplex = string | FooDate | number;
