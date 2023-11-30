/**
 * @internal
 * @deprecated
 */
export class AsyncList<T> {
  constructor(
    public items: T[] = [],
    public lastUpdate: any = null,
    public loading: boolean = false,
    public count: number = items.length
  ) {}
}
