import { Pipe, PipeTransform } from '@angular/core';
import { SkyDocsCategoryColor } from '@skyux/docs-tools';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

@Pipe({
  name: 'skyDocsDefinitionKindToCategoryColor',
})
export class SkyDocsDefinitionKindToCategoryColorPipe implements PipeTransform {
  public transform(
    value: SkyManifestParentDefinitionKind,
  ): SkyDocsCategoryColor {
    switch (value) {
      case 'module':
        return 'purple';

      case 'component':
        return 'orange';

      case 'directive':
        return 'yellow';

      case 'service':
        return 'teal';

      case 'pipe':
      case 'class':
      case 'function':
        return 'blue';

      case 'interface':
      case 'enumeration':
      case 'type-alias':
        return 'light-blue';

      default:
        return 'light-blue';
    }
  }
}
