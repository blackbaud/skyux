import { Observable } from 'rxjs';

/**
 * @internal
 */
export class ListSelectedSetItemsSelectedAction {
  constructor(
    public items: string[] | Observable<string[]>,
    public selected: boolean = false,
    public refresh: boolean = true
  ) {}
}
