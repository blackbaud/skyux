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
        return 'purple';

      case 'component':
        return 'orange';

      case 'directive':
        return 'yellow';

      case 'pipe':
        return 'blue';

      case 'class':
      case 'interface':
      case 'enumeration':
      case 'function':
      case 'type-alias':
        return 'light-blue';

      case 'service':
        return 'teal';

      default:
        return 'light-blue';
    }
  }
}
