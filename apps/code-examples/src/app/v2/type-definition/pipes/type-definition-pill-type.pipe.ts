import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

import { SkyDocsPillColor } from '../../pill/pill-color';

@Pipe({
  name: 'skyTypeDefinitionPillType',
  pure: true,
})
export class SkyTypeDefinitionPillTypePipe implements PipeTransform {
  public transform(value: SkyManifestParentDefinitionKind): SkyDocsPillColor {
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
