import { InjectionToken } from '@angular/core';

// This exists in @skyux/core instead of @skyux/icons in the case where a consuming shared library
// does not have an existing peer dependency on @skyux/icons. Consider moving this to @skyux/icons
// in a breaking change.
export const SKY_ICON_SVG_URL = new InjectionToken<string>('SKY_ICON_SVG_URL');
