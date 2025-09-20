import { Observable } from 'rxjs';

/**
 * @internal
 * @deprecated
 */
export class ListSelectedSetItemsSelectedAction {
  constructor(
    public items: string[] | Observable<string[]>,
    public selected = false,
    public refresh = true,
  ) {}
}
