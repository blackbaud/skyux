/**
 * @internal
 */
export class AsyncList<T> {
  /* tslint:disable:no-null-keyword */
  constructor(
    public items: T[] = [],
    public lastUpdate: any = null,
    public loading: boolean = false,
    public count: number = items.length
  ) { }
}
