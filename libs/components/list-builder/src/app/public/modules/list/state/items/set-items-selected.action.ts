export class ListItemsSetSelectedAction {
  constructor(
    public items: string[],
    public selected: boolean = false,
    public refresh: boolean = true
  ) {}
}
