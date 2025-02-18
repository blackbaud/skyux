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
      case 'module':
        return 'red';

      case 'component':
      case 'directive':
      case 'pipe':
        return 'purple';

      case 'class':
      case 'interface':
        return 'yellow';

      case 'enumeration':
      case 'type-alias':
        return 'orange';

      case 'function':
      case 'service':
        return 'teal';

      default:
        return 'light-blue';
    }
  }
}
