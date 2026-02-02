import { SkyFilterItemModalInstance } from './filter-item-modal-instance';

/**
 * A type marker for passing context object data types into the filter modal component.
 */
export interface SkyFilterItemModal<
  TData = Record<string, unknown> | undefined,
  TValue = unknown,
> {
  /**
   * The filter modal instance to be injected into the component.
   */
  readonly modalInstance: SkyFilterItemModalInstance<TData, TValue>;
}
