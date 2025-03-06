import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyTypeDefinitionKindToLabel',
})
export class SkyDocsTypeDefinitionKindToLabelPipe implements PipeTransform {
  public transform(kind: SkyManifestParentDefinitionKind): string {
    switch (kind) {
      case 'type-alias':
        return 'Type alias';

      default:
        return kind.charAt(0).toLocaleUpperCase() + kind.slice(1);
    }
  }
}
