import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCommentTags
} from './comment-tags';

import {
  SkyDocsDirectiveDefinition
} from './directive-definition';

import {
  SkyDocsEnumerationDefinition
} from './enumeration-definition';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsInterfacePropertyDefinition
} from './interface-property-definition';

import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsPipeDefinition
} from './pipe-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

import {
  SkyDocsClassDefinition
} from './class-definition';

import {
  SkyDocsTypeAliasDefinition,
  SkyDocsTypeAliasFunctionDefinition,
  SkyDocsTypeAliasIndexSignatureDefinition,
  SkyDocsTypeAliasUnionDefinition
} from './type-alias-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

import {
  SkyDocsTypeDefinitions
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  TypeDocComment,
  TypeDocItem,
  TypeDocItemMember,
  TypeDocType
} from './typedoc-types';

import orderBy from 'lodash.orderby';

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) { }

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodePath The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(sourceCodePath: string): SkyDocsTypeDefinitions {

    if (sourceCodePath.charAt(sourceCodePath.length - 1) !== '/') {
      throw new Error('The source code path must end with a forward slash (`/`).');
    }

    const allDefinitions = this.typeDefinitionsProvider.typeDefinitions;
    const requestedDir = sourceCodePath
      .replace(/src\/app\/public\//, '')
      .replace(/^\//, ''); // remove first slash.

    const types: SkyDocsTypeDefinitions = {
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: []
    };

    if (!allDefinitions) {
      console.warn(`No types were found for this project!`);
      return types;
    }

    // Only process types that match the requested source code location.
    const typeDefinitions: TypeDocItem[] = allDefinitions.filter((i) => i.sources[0].fileName.match(requestedDir));
    if (typeDefinitions.length === 0) {
      console.warn(`Type definitions were not found for location: ${requestedDir}`);
    }

    typeDefinitions.forEach((item) => {

      // Components.
      if (this.endsWith(item.name, 'Component')) {
        const definition = this.parseDirectiveDefinition(item);
        types.components.push(definition);
        return;
      }

      // Directives.
      if (this.endsWith(item.name, 'Directive')) {
        const definition = this.parseDirectiveDefinition(item);
        types.directives.push(definition);
        return;
      }

      // Pipes.
      if (this.endsWith(item.name, 'Pipe')) {
        const definition = this.parsePipeDefinition(item);
        types.pipes.push(definition);
        return;
      }

      // Services.
      if (this.endsWith(item.name, 'Service')) {
        const definition = this.parseClassDefinition(item);
        types.services.push(definition);
        return;

      // Classes.
      } else if (item.kindString === 'Class' && !item.decorators) {
        const definition = this.parseClassDefinition(item);
        types.classes.push(definition);
      }

      // Interfaces.
      if (item.kindString === 'Interface') {
        const definition = this.parseInterfaceDefinition(item);
        types.interfaces.push(definition);
        return;
      }

      // Enumerations.
      if (item.kindString === 'Enumeration') {
        const definition = this.parseEnumerationDefinition(item);
        types.enumerations.push(definition);
        return;
      }

      // Type aliases.
      if (item.kindString === 'Type alias') {
        const definition = this.parseTypeAliasDefinition(item);
        types.typeAliases.push(definition);
      }
    });

    return types;
  }

  private parseDirectiveDefinition(item: TypeDocItem): SkyDocsDirectiveDefinition {
    const decoratorSource = item.decorators[0].arguments.obj;
    const selector = (decoratorSource.indexOf('selector: `') > -1)
      ? decoratorSource.split('selector: `')[1].split('`')[0].replace(/\s\s+/g, ' ')
      : decoratorSource.split('selector: \'')[1].split('\'')[0];

    const properties = this.parseClassProperties(item)
      .filter(p => (p.decorator === 'Input' || p.decorator === 'Output'));

    const {
      codeExample,
      codeExampleLanguage,
      description
    } = this.parseCommentTags(item.comment);

    const config: SkyDocsDirectiveDefinition = {
      anchorId: item.anchorId,
      codeExample,
      codeExampleLanguage,
      description,
      name: item.name,
      properties,
      selector
    };

    return config;
  }

  private parseClassDefinition(item: TypeDocItem): SkyDocsClassDefinition {
    const properties = this.parseClassProperties(item);
    const methods: SkyDocsMethodDefinition[] = [];

    item.children.forEach((child) => {
      if (
        child.kindString === 'Method' &&
        child.name.indexOf('ng') !== 0
      ) {
        const definition = this.parseMethodDefinition(child);
        methods.push(definition);
      }
    });

    const {
      description
    } = this.parseCommentTags(item.comment);

    return {
      anchorId: item.anchorId,
      description,
      methods,
      name: item.name,
      properties
    };
  }

  private parseMethodDefinition(item: TypeDocItemMember): SkyDocsMethodDefinition {
    const signature = item.signatures[0];
    const parameters: SkyDocsParameterDefinition[] = [];

    const typeParameters = this.parseTypeParameters(signature);

    if (signature.parameters) {
      signature.parameters.forEach((p) => {
        const defaultValue = this.getDefaultValue(p);
        const parameter: SkyDocsParameterDefinition = {
          description: (p.comment) ? p.comment.text.trim() : '',
          isOptional: (defaultValue) ? true : this.isOptional(p),
          name: p.name,
          type: this.parseFormattedType(p)
        };

        if (defaultValue !== undefined) {
          parameter.defaultValue = defaultValue;
        }

        parameters.push(parameter);
      });
    }

    const {
      codeExample,
      codeExampleLanguage,
      deprecationWarning,
      description
    } = this.parseCommentTags(signature.comment);

    const method: SkyDocsMethodDefinition = {
      codeExample,
      codeExampleLanguage,
      description,
      name: item.name,
      parameters,
      returnType: this.parseFormattedType(signature),
      typeParameters
    };

    if (deprecationWarning !== undefined) {
      method.deprecationWarning = deprecationWarning;
    }

    return method;
  }

  private parsePipeDefinition(item: TypeDocItem): SkyDocsPipeDefinition {
    const {
      codeExample,
      codeExampleLanguage,
      description
    } = this.parseCommentTags(item.comment);

    const transformMethod = item.children.find((child) => {
      return (child.kindString === 'Method' && child.name === 'transform');
    });

    const {
      parameters
    } = this.parseMethodDefinition(transformMethod);

    const firstParameter = parameters.shift();

    return {
      anchorId: item.anchorId,
      codeExample,
      codeExampleLanguage,
      description,
      inputValue: {
        description: firstParameter.description,
        name: firstParameter.name,
        type: firstParameter.type as string
      },
      name: item.name,
      parameters
    };
  }

  private parseInterfaceDefinition(item: TypeDocItem): SkyDocsInterfaceDefinition {
    const properties: SkyDocsInterfacePropertyDefinition[] = [];
    const typeParameters = this.parseTypeParameters(item);

    /*istanbul ignore else*/
    if (item.children) {
      item.children.forEach((p) => {
        const { description: propertyDescription } = this.parseCommentTags(p.comment);
        const isOptional = this.isOptional(p);
        const typeName = this.parseFormattedType(p);
        const property: SkyDocsInterfacePropertyDefinition = {
          description: propertyDescription,
          isOptional,
          name: p.name,
          type: typeName
        };

        properties.push(property);
      });
    }

    if (item.indexSignature) {
      const indexSignature = item.indexSignature[0];
      const param = indexSignature.parameters[0];
      const { description: propertyDescription } = this.parseCommentTags(indexSignature.comment);
      properties.push({
        description: propertyDescription,
        isOptional: false,
        name: `[${param.name}: ${param.type.name}]`,
        type: this.parseFormattedType(indexSignature)
      });
    }

    const {
      description
    } = this.parseCommentTags(item.comment);

    return {
      anchorId: item.anchorId,
      description,
      name: item.name,
      properties,
      typeParameters
    };
  }

  private parseEnumerationDefinition(item: TypeDocItem): SkyDocsEnumerationDefinition {
    const members = item.children.map((p) => {
      const {
        description: memberDescription
      } = this.parseCommentTags(p.comment);

      return {
        description: memberDescription,
        name: `${item.name}.${p.name}`
      };
    });

    const {
      description
    } = this.parseCommentTags(item.comment);

    return {
      anchorId: item.anchorId,
      description,
      members,
      name: item.name
    };
  }

  private parseTypeAliasDefinition(item: TypeDocItem): SkyDocsTypeAliasDefinition {
    const {
      description,
      parameters: paramTags
    } = this.parseCommentTags(item.comment);

    if (item.type.type === 'union') {
      const types = item.type.types.map((t) => {
        const typeName = t.name;

        if (t.type === 'intrinsic' || t.type === 'reference') {
          return typeName;
        }

        if (t.type === 'stringLiteral') {
          return `'${t.value}'`;
        }

        return typeName;
      });

      const typeAlias: SkyDocsTypeAliasUnionDefinition = {
        anchorId: item.anchorId,
        description,
        name: item.name,
        types
      };

      return typeAlias;
    }

    /*istanbul ignore else*/
    if (item.type.type === 'reflection') {
      if (item.type.declaration.signatures) {
        const callSignature = item.type.declaration.signatures[0];
        const parameters = callSignature.parameters.map((p) => {
          const isOptional = this.isOptional(p);
          const tagParam = (paramTags) ? paramTags.find((param) => param.name === p.name) : undefined;

          const parameter: SkyDocsParameterDefinition = {
            description: tagParam?.description,
            isOptional,
            name: p.name,
            type: p.type.name
          };

          return parameter;
        });

        const typeAlias: SkyDocsTypeAliasFunctionDefinition = {
          anchorId: item.anchorId,
          description,
          name: item.name,
          parameters,
          returnType: callSignature.type.name
        };

        return typeAlias;
      }

      /*istanbul ignore else*/
      if (item.type.declaration.indexSignature) {
        const indexSignature = item.type.declaration.indexSignature[0];
        const param = indexSignature.parameters[0];

        const typeAlias: SkyDocsTypeAliasIndexSignatureDefinition = {
          anchorId: item.anchorId,
          description,
          name: item.name,
          keyName: param.name,
          valueType: indexSignature.type.name
        };

        return typeAlias;
      }
    }
  }

  private parseFormattedType(item: TypeDocItemMember): SkyDocsTypeDefinition {
    const typeConfig = item.type;

    let formatted = 'any';

    // Parse complex types.
    if (typeConfig.type === 'reflection') {
      /*istanbul ignore else*/
      if (typeConfig.declaration.signatures) {
        const callSignature = typeConfig.declaration.signatures[0];
        return {
          callSignature: {
            returnType: this.parseFormattedType(callSignature),
            parameters: this.parseCallSignatureParameters(item)
          }
        };
      }
    }

    // Parse union types.
    if (typeConfig.type === 'union') {
      return this.parseUnionType(typeConfig);
    }

    if (typeConfig.name) {
      formatted = typeConfig.name;
    } else {
      const elementType = typeConfig.elementType;
      /*istanbul ignore else*/
      if (elementType?.name) {
        formatted = elementType.name;
      }
    }

    // Parse any type arguments e.g. `<T, F>`.
    if (typeConfig.typeArguments) {
      const typeArguments = typeConfig.typeArguments.map((typeArgument) => {
        if (typeArgument.type === 'array') {
          return `${typeArgument.elementType.name}[]`;
        } else if (typeArgument.type === 'union') {
          return this.parseUnionType(typeArgument);
        }
        return typeArgument.name;
      });

      formatted += `<${typeArguments.join(', ')}>`;
    }

    if (typeConfig.type === 'array') {
      formatted += '[]';
    }

    return formatted;
  }

  private parseUnionType(typeConfig: TypeDocType): SkyDocsTypeDefinition {
    return typeConfig.types.map(t => this.parseFormattedType({ type: t })).join(' | ');
  }

  private parseCommentTags(comment: TypeDocComment): SkyDocsCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';
    let parameters: { name: string; description: string }[];

    const extras: {
      [key: string]: any
    } = {};

    if (comment) {
      /*istanbul ignore else*/
      if (comment.tags) {
        comment.tags.forEach((tag) => {
          switch (tag.tag) {
            case 'deprecated':
              /*istanbul ignore else*/
              deprecationWarning = tag.text.trim();
              break;

            case 'default':
            case 'defaultvalue':
            case 'defaultValue':
              defaultValue = tag.text.trim();
              break;

            case 'example':
              /*istanbul ignore else*/
              codeExample = tag.text.trim().split('```')[1].trim();
              const language = codeExample.split('\n')[0];
              if (language === 'markup' || language === 'typescript') {
                codeExample = codeExample.slice(language.length).trim();
                codeExampleLanguage = language;
              }
              break;

            case 'param':
              parameters = parameters || [];
              parameters.push({
                name: tag.param,
                description: tag.text.trim()
              });
              break;

            default:
              extras[tag.tag] = tag.text;
              break;
          }
        });
      }

      if (comment.shortText) {
        description = comment.shortText;
      }
    }

    return {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationWarning,
      description,
      extras,
      parameters
    };
  }

  private parseCallSignatureParameters(item: TypeDocItemMember): SkyDocsParameterDefinition[] {
    if (
      !item.type.declaration.signatures ||
      !item.type.declaration.signatures[0].parameters
    ) {
      return [];
    }

    const { parameters } = this.parseCommentTags(item.comment);

    return item.type.declaration.signatures[0].parameters.map((p) => {

      let description = '';
      if (parameters) {
        description = parameters.find(param => param.name === p.name).description;
      }

      const parameter: SkyDocsParameterDefinition = {
        isOptional: this.isOptional(p),
        name: p.name,
        type: this.parseFormattedType(p)
      };

      /* istanbul ignore else */
      if (description !== undefined) {
        parameter.description = description;
      }

      return parameter;
    });
  }

  private parseTypeParameters(item: TypeDocItem): string[] {
    let typeParameters: string[] = [];
    if (item.typeParameter) {
      typeParameters = item.typeParameter.map((t) => {
        if (t.type && t.type.type === 'reference') {
          return `${t.name} extends ${t.type.name}`;
        }

        return t.name;
      });
    }

    return typeParameters;
  }

  private parseClassProperties(item: TypeDocItem): SkyDocsPropertyDefinition[] {
    let properties: SkyDocsPropertyDefinition[] = [];

    if (!item.children) {
      return properties;
    }

    item.children.forEach((child) => {
      let description: string;
      let type: SkyDocsTypeDefinition;

      const tags = this.parseCommentTags(child.comment);
      const decorator = (child.decorators) ? child.decorators[0].name as 'Input' | 'Output' : undefined;
      const deprecationWarning = tags.deprecationWarning;
      const defaultValue = this.getDefaultValue(child);
      const kindString = child.kindString;

      /*tslint:disable-next-line:switch-default*/
      switch (kindString) {
        case 'Property':
          description = tags.description;
          type = this.parseFormattedType(child);
          break;

        case 'Accessor':
          /*istanbul ignore else*/
          if (child.setSignature) {
            const setSignature = child.setSignature[0];
            const {
              description: setSignatureDescription
            } = this.parseCommentTags(setSignature.comment);
            description = setSignatureDescription;
            type = this.parseFormattedType(setSignature.parameters[0]);
          } else if (child.getSignature) {
            const getSignature = child.getSignature[0];
            const {
              description: getSignatureDescription
            } = this.parseCommentTags(getSignature.comment);
            description = getSignatureDescription;
            type = this.parseFormattedType(getSignature);
          }
          break;

        // Abort if not a supported type.
        default:
          return;
      }

      const isOptional = (decorator === 'Output') ? true : this.isOptional(child);
      const name = (decorator === 'Input')
        ? this.parseInputBindingName(child)
        : child.name;

      const property: SkyDocsPropertyDefinition = {
        description,
        isOptional,
        name,
        type
      };

      if (decorator !== undefined) {
        property.decorator = decorator;
      }

      if (defaultValue !== undefined && decorator !== 'Output') {
        property.defaultValue = defaultValue;
      }

      if (deprecationWarning !== undefined) {
        property.deprecationWarning = deprecationWarning;
      }

      properties.push(property);
    });

    properties = orderBy(
      properties,
      ['decorator', 'isOptional', 'name'],
      ['asc', 'asc', 'asc']
    );

    return properties;
  }

  private parseInputBindingName(child: TypeDocItemMember): string {
    return child.decorators[0].arguments.bindingPropertyName?.replace(/\'/g, '') || child.name;
  }

  /**
   * Cross-browser check if string ends with another string.
   * See: https://www.freecodecamp.org/news/two-ways-to-confirm-the-ending-of-a-string-in-javascript-62b4677034ac/
   */
  private endsWith(haystack: string, needle: string): boolean {
    return (haystack.substr(needle.length * -1) === needle);
  }

  private isOptional(item: TypeDocItemMember): boolean {
    // If `@required` is in the comment, mark it as required.
    const tags = this.parseCommentTags(item.comment);
    if (tags.extras.required) {
      return false;
    }

    if (item.kindString === 'Parameter') {
      return !!(item.flags && item.flags.isOptional);
    }

    return true;
  }

  private getDefaultValue(item: TypeDocItemMember): string {
    const tags = this.parseCommentTags(item.comment);

    let defaultValue: string = tags.defaultValue || item.defaultValue;
    if (defaultValue) {
      defaultValue = defaultValue.replace(/\"/g, '\'');
    }

    return defaultValue;
  }

}
