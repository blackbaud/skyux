/**
 * @internal
 * @deprecated
 */
export class ListItemsSetSelectedAction {
  constructor(
    public items: string[],
    /* istanbul ignore next */
    public selected = false,
    public refresh = true,
  ) {}
}
