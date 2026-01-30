import { SkyFilterItemModalContext } from './filter-item-modal-context';
import { SkyFilterItemModalSavedArgs } from './filter-item-modal-saved-args';

/**
 * A specialized `SkyModalInstance` wrapper.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 * @typeParam TData - The type of the additional context data. Defaults to `Record<string, unknown>`.
 */
export abstract class SkyFilterItemModalInstance<
  TValue = unknown,
  TData = Record<string, unknown>,
> {
  /**
   * The context provided to the filter modal component.
   */
  public abstract readonly context: SkyFilterItemModalContext<TValue, TData>;

  /**
   * Closes the modal instance with `reason="cancel"`.
   */
  public abstract cancel(): void;

  /**
   * Closes the modal instance with `reason="save"`.
   * @param args
   */
  public abstract save(args: SkyFilterItemModalSavedArgs<TValue>): void;
}
