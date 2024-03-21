/* eslint-disable @nx/enforce-module-boundaries */
import { Type } from '@angular/core';
import { SkyModalCloseArgs } from '@skyux/modals';

/**
 * A controller to be injected into tests, which mocks the modal service
 * and handles interactions with modal instances.
 */
export abstract class SkyModalTestingController {
  /**
   * Throws if modals are open.
   */
  public abstract expectNone(): void;

  /**
   * Throws if the given criteria does not match the topmost open modal.
   */
  public abstract expectTopmostOpen<T>(component: Type<T>): void;

  /**
   *
   * @param index The index of the modal's open order.
   * @param args Arguments to pass to the modal's close event.
   */
  public abstract closeTopmost(args?: SkyModalCloseArgs): void;

  /**
   * Returns the number of open modals.
   */
  public abstract count(): number;
}

// TODO: How to handle onBeforeClose?
// TODO: How to handle modalDirty?
// TODO: How to handle modal errors?
