import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooTypeFunction.
 * @param needle  The string to find.
 * @param haystack  The string to search.
 */
export type FooTypeFunction = (
  needle: string,
  haystack?: string
) => FooUser;
