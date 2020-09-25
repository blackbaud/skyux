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
  haystack?: string,
  user?: FooUser
) => FooUser;

/**
 * This type doesn't have descriptions for the arguments.
 */
export type FooTypeFunctionNoArgsDescription<T> = (args: FooUser, addl: T, data: any[]) => void;
