import { InjectionToken } from '@angular/core';

/**
 * Lets a projected `sky-token` element read the grid-role state of its ancestor
 * `sky-tokens` component. Angular does not apply template bindings to content
 * projected elements, so `sky-token` cannot receive its `role` the same way
 * tokens generated from the `tokens` input do.
 * @internal
 */
export interface SkyTokensRoleContext {
  /**
   * Whether the ancestor `sky-tokens` component's grid role is currently active.
   */
  readonly gridRoleActive: () => boolean;
}

/** @internal */
export const SKY_TOKENS_ROLE_CONTEXT = new InjectionToken<SkyTokensRoleContext>(
  'SkyTokensRoleContext',
);
