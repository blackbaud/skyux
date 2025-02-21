import { Pipe, PipeTransform } from '@angular/core';
import { SkyPillColor } from '@skyux/docs-tools';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

@Pipe({
  name: 'skyKindToPillColor',
  pure: true,
})
export class SkyKindToPillColorPipe implements PipeTransform {
  public transform(value: SkyManifestParentDefinitionKind): SkyPillColor {
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
