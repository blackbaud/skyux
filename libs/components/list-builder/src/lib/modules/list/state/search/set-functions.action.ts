/**
 * @internal
 * @deprecated
 */
export class ListSearchSetFunctionsAction {
  constructor(
    public functions: ((data: any, searchText: string) => boolean)[] = [],
  ) {}
}
