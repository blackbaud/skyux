import { Type } from '@angular/core';

export interface SkyFilterBarFilterModalConfig {
  /**
   * The modal component to display when the user selects the filter.
   * The component should expect a `SkyFilterBarFilterModalContext` object to be provided by the modal service on instantiation.
   * The return value of the modal save action should be a `SkyFilterBarFilterValue`.
   * @required
   */
  modalComponent: Type<unknown>;
  /**
   * The size of the modal to display.
   * @default 'medium'
   */
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  /**
   * Any additional properties to be passed in to the filter modal.
   */
  additionalContext?: Record<string, unknown>;
}
