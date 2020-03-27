import {
  Injectable
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

import {
  SkyDocsTypeAliasFunctionDefinition,
  SkyDocsTypeAliasIndexSignatureDefinition,
  SkyDocsTypeAliasUnionDefinition
} from './type-alias-definition';

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  constructor(
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public getInterfaceSignature(definition: SkyDocsInterfaceDefinition): string {
    const typeParameterSignature: string = (definition.typeParameters && definition.typeParameters.length)
      ? `<${definition.typeParameters.join(', ')}>`
      : '';

    let signature: string = `interface ${definition.name}${typeParameterSignature} {`;

    definition.properties.forEach((property) => {
      const optionalIndicator = (property.isOptional) ? '?' : '';
      signature += `\n  ${property.name}${optionalIndicator}: ${property.type.replace(/\"/g, '\'')};`;
    });

    signature += '\n}';

    return signature;
  }

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    const typeParameterSignature: string = (method.typeParameters && method.typeParameters.length)
      ? `<${method.typeParameters.join(', ')}>`
      : '';

    let signature = `public ${method.name}${typeParameterSignature}(`;

    if (method.parameters) {
      signature += method.parameters
        .map((parameter) => this.getParameterSignature(parameter, {
          createAnchorLinks: false,
          escapeSpecialCharacters: false
        }))
        .join(', ');
    }

    const returnType = (method.returnType)
      ? method.returnType
      : 'void';

    signature += `): ${returnType}`;

    return signature;
  }

  public getParameterSignature(
    parameter: SkyDocsParameterDefinition,
    config: {
      createAnchorLinks?: boolean;
      escapeSpecialCharacters?: boolean;
    } = {
      createAnchorLinks: true,
      escapeSpecialCharacters: true
    }
  ): string {
    const optionalMarker = (parameter.isOptional && !parameter.defaultValue) ? '?' : '';
    const defaultValue = (parameter.defaultValue) ? ` = ${parameter.defaultValue}` : '';

    let signature = `${parameter.name}${optionalMarker}: ${parameter.type}${defaultValue}`;

    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    if (config.createAnchorLinks) {
      signature = this.anchorLinkService.applyTypeAnchorLinks(signature);
    }

    return signature;
  }

  public getPropertySignature(item: SkyDocsPropertyDefinition): string {
    let signature = '';

    if (item.decorator) {
      signature += `@${item.decorator}()<br />`;
    }

    if (item.deprecationWarning) {
      signature += `<strike>${item.name}</strike>`;
    } else {
      signature += `${item.name}`;
    }

    if (!item.type) {
      return signature;
    }

    // Don't use the '?' indicator if the property has a decorator.
    if (item.isOptional && !item.decorator) {
      signature += '?';
    }

    const propertyType = this.anchorLinkService.applyTypeAnchorLinks(
      this.escapeSpecialCharacters(item.type)
    );

    signature += `: ${propertyType}`;

    return signature;
  }

  public getTypeAliasSignature(
    definition: SkyDocsTypeAliasIndexSignatureDefinition |
      SkyDocsTypeAliasFunctionDefinition |
      SkyDocsTypeAliasUnionDefinition
  ): string {
    let signature = `type ${definition.name} = `;

    // Function type
    if ('returnType' in definition) {
      const parameters = (definition.parameters)
        ? definition.parameters.map(p => this.getParameterSignature(p))
        : [];

      signature += `(${parameters.join(', ')}) => ${definition.returnType}`;
    }

    // Index signature
    if ('keyName' in definition) {
      signature += `{ [${definition.keyName}: string]: ${definition.valueType} }`;
    }

    // Union type
    if ('types' in definition) {
      signature += definition.types.join(' | ');
    }

    return signature;
  }

  private escapeSpecialCharacters(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

}
