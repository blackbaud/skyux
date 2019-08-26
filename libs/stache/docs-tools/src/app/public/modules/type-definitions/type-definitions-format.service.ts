import {
  Injectable
} from '@angular/core';
import { SkyDocsMethodDefinition } from './type-definitions';

@Injectable({
  providedIn: 'root'
})
export class SkyDocsTypeDefinitionsFormatService {

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    let signature = `public ${method.name}(`;

    if (method.parameters.length) {
      const parameters: string[] = [];

      method.parameters.forEach((parameter) => {
        const optionalMarker = (parameter.defaultValue || parameter.isOptional) ? '?' : '';

        parameters.push(
          `${parameter.name}${optionalMarker}: ${parameter.type}`
        );
      });

      signature += parameters.join(', ');
    }

    signature += `): ${method.returnType}`;

    return signature;
  }

}
