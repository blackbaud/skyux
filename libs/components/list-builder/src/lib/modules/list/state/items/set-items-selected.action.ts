/**
 * @internal
 */
export class ListItemsSetSelectedAction {
  constructor(
    public items: string[],
    /* istanbul ignore next */
    public selected: boolean = false,
    public refresh: boolean = true
  ) {}
}
