import {
  Injectable
} from '@angular/core';

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

import {
  SkyDocsTypeDefinition
} from './type-definition';

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  public getInterfaceSignature(definition: SkyDocsInterfaceDefinition, config?: {
    createAnchorLinks: boolean;
  }): string {
    const typeParameterSignature: string = (definition.typeParameters && definition.typeParameters.length)
      ? `<${definition.typeParameters.join(', ')}>`
      : '';

    let signature: string = `interface ${definition.name}${typeParameterSignature} {`;

    definition.properties.forEach((property) => {
      const propertyType = (typeof property.type === 'string')
        ? property.type
        : this.formatCallSignature(property.type.callSignature, {
          createAnchorLinks: config.createAnchorLinks
        });

      const optionalIndicator = (property.isOptional) ? '?' : '';
      signature += `\n  ${property.name}${optionalIndicator}: ${propertyType.replace(/\"/g, '\'')};`;
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

    const parameterType = (!parameter.type || typeof parameter.type === 'string')
      ? parameter.type
      : this.formatCallSignature(parameter.type.callSignature, {
        createAnchorLinks: false
      });

    let signature = `${parameter.name}${optionalMarker}: ${parameterType}${defaultValue}`;

    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
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

    let propertyType = (typeof item.type === 'string')
      ? item.type
      : this.formatCallSignature(item.type.callSignature, {
        createAnchorLinks: false
      });

    signature += `: ${propertyType}`;

    return signature;
  }

  public getTypeAliasSignature(
    definition: SkyDocsTypeAliasIndexSignatureDefinition |
      SkyDocsTypeAliasFunctionDefinition |
      SkyDocsTypeAliasUnionDefinition,
    config: {
      createAnchorLinks: boolean;
    } = {
      createAnchorLinks: true
    }
  ): string {
    let signature = `type ${definition.name} = `;

    // Function type
    if ('returnType' in definition) {
      signature += this.formatCallSignature(definition, {
        createAnchorLinks: config.createAnchorLinks
      });
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

  private formatCallSignature(definition: {
    parameters?: SkyDocsParameterDefinition[];
    returnType?: SkyDocsTypeDefinition;
  }, config?: {
    createAnchorLinks?: boolean;
  }): string {
    const parameters = (definition.parameters)
      ? definition.parameters.map(p => this.getParameterSignature(p, config))
      : [];

    return `(${parameters.join(', ')}) => ${definition.returnType}`;
  }

}
