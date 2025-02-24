import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

@Pipe({
  name: 'skyTypeDefinitionKindToLabel',
})
export class SkyTypeDefinitionKindToLabelPipe implements PipeTransform {
  public transform(kind: SkyManifestParentDefinitionKind): string {
    switch (kind) {
      case 'type-alias':
        return 'Type alias';

      default:
        return kind.charAt(0).toLocaleUpperCase() + kind.slice(1);
    }
  }
}
