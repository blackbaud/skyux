import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

import { SkyPillCategoryType } from '../../pill/pill-category-type';

@Pipe({
  name: 'skyTypeDefinitionPillType',
  pure: true,
})
export class SkyTypeDefinitionPillTypePipe implements PipeTransform {
  public transform(
    value: SkyManifestParentDefinitionKind,
  ): SkyPillCategoryType {
    switch (value) {
      case 'module':
        return 'blue';

      case 'component':
      case 'directive':
      case 'pipe':
        return 'purple';

      case 'interface':
      case 'enumeration':
      case 'type-alias':
        return 'orange';

      case 'class':
      case 'function':
      case 'service':
        return 'light-blue';

      default:
        return 'light-blue';
    }
  }
}
