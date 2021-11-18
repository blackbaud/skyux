/**
 * @internal
 */
export class AsyncItem<T> {
  /* tslint:disable:no-null-keyword */
  constructor(
    public item: T = <T>{},
    public lastUpdate: any = null,
    public loading: boolean = false
  ) {}
}
