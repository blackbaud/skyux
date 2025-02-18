import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinitionKind } from '@skyux/manifest';

@Pipe({
  name: 'skyTypeDefinitionKindToLabel',
  pure: true,
})
export class SkyTypeDefinitionKindToLabelPipe implements PipeTransform {
  public transform(value: SkyManifestParentDefinitionKind): string {
    switch (value) {
      case 'type-alias':
        return 'Type alias';

      default:
        return value.charAt(0).toLocaleUpperCase() + value.slice(1);
    }
  }
}
