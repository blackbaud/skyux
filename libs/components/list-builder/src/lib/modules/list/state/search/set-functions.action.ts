import { ListSearchFunction } from './search-function';

/**
 * @internal
 * @deprecated
 */
export class ListSearchSetFunctionsAction {
  constructor(public functions: ListSearchFunction[] = []) {}
}
