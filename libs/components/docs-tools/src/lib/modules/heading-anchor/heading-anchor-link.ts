import { TemplateRef } from '@angular/core';

import { SkyDocsCategoryColor } from '../category-tag/category-color';

/**
 * @internal
 */
export interface SkyDocsHeadingAnchorLink {
  anchorId: string;
  categoryColor?: SkyDocsCategoryColor;
  categoryTemplate?: TemplateRef<unknown>;
  categoryText?: string;
  text: string;
}
