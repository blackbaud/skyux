/**
 * @internal
 */
export class AsyncItem<T> {
  constructor(
    public item: T = {} as T,
    public lastUpdate: any = null,
    public loading = false
  ) {}
}
