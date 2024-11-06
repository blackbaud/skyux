import { Type } from '@angular/core';
import { SkyModalCloseArgs } from '@skyux/modals';

/**
 * A controller to be injected into tests, which mocks the modal service
 * and handles interactions with modal instances. For testing interactions
 * with the modal component itself, use the `SkyModalHarness`.
 */
export abstract class SkyModalTestingController {
  /**
   * Closes the topmost modal with the provided arguments.
   * @param args Arguments to pass to the modal's close event.
   */
  public abstract closeTopModal(args?: SkyModalCloseArgs): void;

  /**
   * Throws if the provided value does not match the number of open modals.
   */
  public abstract expectCount(value: number): void;

  /**
   * Throws if modals are open.
   */
  public abstract expectNone(): void;

  /**
   * Throws if the given criteria does not match the topmost open modal.
   */
  public abstract expectOpen<TComponent>(component: Type<TComponent>): void;
}
