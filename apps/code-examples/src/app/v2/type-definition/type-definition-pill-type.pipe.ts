import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

import { SkyPillCategoryType } from '../pill/pill-category-type';

@Pipe({
  name: 'skyTypeDefinitionPillType',
  pure: true,
})
export class SkyTypeDefinitionPillTypePipe implements PipeTransform {
  public transform(
    value: SkyManifestParentDefinitionKind,
  ): SkyPillCategoryType {
    switch (value) {
      case 'component':
      case 'directive':
        return 'blue';

      case 'enumeration':
      case 'interface':
      case 'type-alias':
        return 'orange';

      case 'service':
        return 'teal';

      default:
        return 'light-blue';
    }
  }
}
