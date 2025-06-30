import { Type } from '@angular/core';

export interface SkyFilterBarFilterModalConfig {
  modalComponent: Type<unknown>;

  modalSize?: 'small' | 'medium' | 'large' | 'full';

  additionalContext?: Record<string, unknown>;
}
