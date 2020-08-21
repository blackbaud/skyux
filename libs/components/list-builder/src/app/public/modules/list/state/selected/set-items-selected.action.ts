import {
  Observable
} from 'rxjs';

export class ListSelectedSetItemsSelectedAction {
  constructor(
    public items: string[] | Observable<string[]>,
    public selected: boolean = false,
    public refresh: boolean = true) {}
}
