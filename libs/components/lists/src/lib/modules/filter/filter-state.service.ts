import { Observable } from 'rxjs';

import { SkyFilterState } from './filter-state';

/**
 * Used to send and receive filter states between components.
 * @internal
 */
export abstract class SkyFilterStateService {
  public abstract readonly dataStateChanges: Observable<SkyFilterState>;
  public abstract readonly filterBarChanges: Observable<SkyFilterState>;

  public abstract updateDataState(value: SkyFilterState): void;
  public abstract updateFilterBar(value: SkyFilterState): void;
}
