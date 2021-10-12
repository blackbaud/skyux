import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition
} from './call-signature-definition';

import {
  SkyDocsClassPropertyDefinition
} from './property-definition';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsClassMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsTypeAliasDefinition
} from './type-alias-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

import {
  SkyDocsTypeParameterDefinition
} from './type-parameter-definition';

import {
  SkyDocsInterfacePropertyDefinition
} from './interface-property-definition';

interface GetFormattedTypeConfig {
  escapeSpecialCharacters: boolean;
}

/**
 * Formats type definitions into HTML-compatible strings.
 */
@Injectable({
  providedIn: 'root'
})
export class SkyDocsTypeDefinitionsFormatService {

  /**
   * Returns an HTML-formatted representation of the provided interface config.
   */
  public getInterfaceSourceCode(definition: SkyDocsInterfaceDefinition): string {
    const typeParameters = this.getFormattedTypeParameters(definition.typeParameters);
    const config = {
      escapeSpecialCharacters: false
    };

    let signature: string = `interface ${definition.name}${typeParameters} {`;
    signature += this.getFormattedInterfaceProperties(definition, config);
    signature += '\n}';

    return signature;
  }

  /**
   * Returns an HTML-formatted representation of the provided method config.
   */
  public getMethodSourceCode(definition: SkyDocsClassMethodDefinition): string {
    const config = {
      escapeSpecialCharacters: false
    };

    const typeArguments = this.getFormattedTypeArguments(definition.type, config);
    const callSignature = definition.type.callSignature;
    const returnType = this.getFormattedType(callSignature.returnType, config);

    let params: string = '';
    if (callSignature.parameters) {
      params += callSignature.parameters
        .map(p => this.getFormattedParameterName(p, config))
        .join(', ');
    }

    return `public ${definition.name}${typeArguments}(${params}): ${returnType}`;
  }

  /**
   * Returns an HTML-formatted representation of the provided type alias config.
   */
  public getTypeAliasSourceCode(definition: SkyDocsTypeAliasDefinition): string {
    const config = {
      escapeSpecialCharacters: false
    };

    const typeParameters = this.getFormattedTypeParameters(definition.typeParameters);

    let signature = `type ${definition.name}${typeParameters} = `;

    if (definition.type.callSignature) {
      signature += this.getFormattedCallSignature(definition.type.callSignature, {
        escapeSpecialCharacters: false
      });
    } else if (definition.type.indexSignature) {
      const indexSignature = definition.type.indexSignature;
      const type = this.getFormattedType(indexSignature.type, {
        escapeSpecialCharacters: false
      });
      signature += `{\n  [${indexSignature.key.name}: string]: ${type};\n}`;
    } else {
      /*istanbul ignore else */
      if (definition.type.type === 'union') {
        signature += this.getFormattedUnion(definition.type, config);
      }
    }

    return signature;
  }

  /**
   * Returns a formatted string representing a parameter's name and value. For example: `'foo: string'`.
   */
  public getFormattedParameterName(
    parameter: SkyDocsParameterDefinition,
    config: GetFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const optionalMarker = (parameter.isOptional) ? '?' : '';
    const parameterType = this.getFormattedType(parameter.type, config);

    let signature = `${parameter.name}${optionalMarker}: ${parameterType}`;
    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    return signature;
  }

  /**
   * Returns a formatted string representing a property (or method's) name and value. For example: `'public foo: string'`.
   */
  public getFormattedPropertyName(property: SkyDocsClassPropertyDefinition): string {
    let signature = '';

    if (property.decorator?.name) {
      signature += `@${property.decorator.name}()<br>`;
    }

    const indexSignature = property.type?.indexSignature;
    let name: string;
    if (indexSignature) {
      name = `[${indexSignature.key.name}: ${this.getFormattedType(indexSignature.key.type)}]`;
    } else {
      name = property.name;
    }

    if (property.deprecationWarning !== undefined) {
      signature += `<strike>${name}</strike>`;
    } else {
      signature += name;
    }

    if (property.isOptional && !indexSignature) {
      signature += '?';
    }

    if (indexSignature) {
      signature += `: ${this.getFormattedType(indexSignature.type)}`;
    } else if (property.type) {
      signature += `: ${this.getFormattedType(property.type)}`;
    }

    return signature;
  }

  /**
   * Returns an HTML-formatted method name to be used on the properties table.
   */
  public getFormattedMethodName(definition: SkyDocsClassMethodDefinition): string {
    let formatted = '';

    if (definition.deprecationWarning !== undefined) {
      formatted += `<strike>${definition.name}</strike>`;
    } else {
      formatted += definition.name;
    }

    return `${formatted}()`;
  }

  /**
   * Returns a formatted string representing the provided type.
   */
  public getFormattedType(
    type: SkyDocsTypeDefinition,
    config: GetFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let formatted = 'any';

    if (!type) {
      return formatted;
    }

    if (type.callSignature) {
      return this.getFormattedCallSignature(type.callSignature, config);
    }

    if (type.unionTypes) {
      return this.getFormattedUnion(type, config);
    }

    if (type.name) {
      formatted = type.name;
    }

    if (type.typeArguments) {
      formatted += this.getFormattedTypeArguments(type, config);
    }

    if (type.type === 'array') {
      formatted += '[]';
    }

    if (type.typeLiteral) {
      const formattedTypeLiteral = this.getFormattedInterfaceProperties(type.typeLiteral, config)
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ');
      formatted = `{${formattedTypeLiteral} }`;
    }

    if (config.escapeSpecialCharacters) {
      return this.escapeSpecialCharacters(formatted);
    }

    return formatted;
  }

  public escapeSpecialCharacters(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private getFormattedCallSignature(
    callSignature: SkyDocsCallSignatureDefinition,
    config: GetFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const returnType = this.getFormattedType(callSignature.returnType, config);

    if (!callSignature.parameters) {
      return `() => ${returnType}`;
    }

    const formattedParams = callSignature.parameters
      .map(p => this.getFormattedParameterName(p, config))
      .join(', ');

    return `(${formattedParams}) => ${returnType}`;
  }

  private getFormattedUnion(typeConfig: SkyDocsTypeDefinition, config: GetFormattedTypeConfig): string {
    return typeConfig.unionTypes.map(t => {
      return this.getFormattedType(t, config);
    }).join(' | ');
  }

  /**
   * Parse any type arguments e.g. `<T, F>`.
   */
  private getFormattedTypeArguments(typeConfig: SkyDocsTypeDefinition, config: GetFormattedTypeConfig): string {
    if (!typeConfig.typeArguments) {
      return '';
    }

    const typeArguments = typeConfig.typeArguments.map(typeArgument => {
      if (typeArgument.type === 'array') {
        return `${typeArgument.name}[]`;
      }

      if (typeArgument.unionTypes) {
        return this.getFormattedUnion(typeArgument, config);
      }

      return typeArgument.name;
    });

    return `<${typeArguments.join(', ')}>`;
  }

  private getFormattedTypeParameters(typeParameters: SkyDocsTypeParameterDefinition[]): string {
    if (!typeParameters) {
      return '';
    }

    const formatted = typeParameters.map(typeParameter => {
      let result = typeParameter.name;
      if (typeParameter.type && typeParameter.type.type === 'reference') {
        result += ` extends ${typeParameter.type.name}`;
      }

      return result;
    });

    return `<${formatted.join(', ')}>`;
  }

  private getFormattedInterfaceProperties(
    definition: {
      properties?: SkyDocsInterfacePropertyDefinition[];
    },
    config?: GetFormattedTypeConfig
  ): string {
    let signature: string = '';

    definition.properties.forEach(property => {
      const indexSignature = property.type.indexSignature;
      const optionalIndicator = (property.isOptional && !indexSignature) ? '?' : '';
      const propertyType = this.getFormattedType(property.type, config);

      let name: string;
      if (indexSignature) {
        name = `[${indexSignature.key.name}: string]`;
      } else {
        name = property.name;
      }

      signature += `\n  ${name}${optionalIndicator}: ${propertyType};`;
    });

    return signature;
  }

}
