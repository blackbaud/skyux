import { Pipe, PipeTransform } from '@angular/core';
import {
  SkyManifestClassMethodDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

@Pipe({
  name: 'skyDocsMethodName',
})
export class SkyDocsMethodNamePipe implements PipeTransform {
  public transform(
    method: SkyManifestClassMethodDefinition,
    parent: SkyManifestParentDefinition,
  ): string {
    if (method.isStatic) {
      return `${parent.name}.${method.name}`;
    }

    return `${method.name}`;
  }
}
