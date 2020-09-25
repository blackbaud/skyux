import {
  FooDate
} from './foo-date';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooTypeUnionComplex. It can be of type [[FooDate]].
 */
export type FooTypeUnionComplex<T extends FooUser> = string | FooDate | number | false | 1 | T | (() => void);
