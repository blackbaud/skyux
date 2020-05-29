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
  SkyDocsDirectivePropertyDefinition
} from './directive-property-definition';

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
  SkyDocsTypeDefinitions
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

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
    const typeDefinitions = allDefinitions.filter((i: any) => i.sources[0].fileName.match(requestedDir));
    if (typeDefinitions.length === 0) {
      console.warn(`Type definitions were not found for location: ${requestedDir}`);
    }

    typeDefinitions.forEach((item: any) => {

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

  private parseDirectiveDefinition(item: any): SkyDocsDirectiveDefinition {
    const selector = item.decorators[0].arguments.obj.split('selector: \'')[1].split('\'')[0];
    const properties: SkyDocsDirectivePropertyDefinition[] = [];

    const {
      codeExample,
      codeExampleLanguage,
      description
    } = this.parseCommentTags(item.comment);

    /*istanbul ignore else*/
    if (item.children) {
      item.children.forEach((c: any) => {
        const kindString = c.kindString;

        /*istanbul ignore else*/
        if (
          kindString === 'Property' ||
          kindString === 'Accessor'
        ) {
          if (!c.decorators) {
            return;
          }

          const decorator = c.decorators[0].name;

          /*istanbul ignore else*/
          if (
            decorator === 'Input' ||
            decorator === 'Output'
          ) {
            const property = this.parseDirectivePropertyDefinition(kindString, c);
            properties.push(property);
          }
        }
      });
    }

    this.sortDirectiveProperties(properties, 'name');
    this.sortDirectiveProperties(properties, 'isOptional');
    this.sortDirectiveProperties(properties, 'decorator');

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

  private parseDirectivePropertyDefinition(kindString: string, item: any): SkyDocsDirectivePropertyDefinition {
    let description: string;
    let typeName: string;

    const tags = this.parseCommentTags(item.comment);
    const decorator = item.decorators[0].name;
    const deprecationWarning = tags.deprecationWarning;
    const defaultValue = this.getDefaultValue(item);

    /*tslint:disable-next-line:switch-default*/
    switch (kindString) {
      case 'Property':
        description = tags.description;
        typeName = this.parseFormattedType(item.type);
        break;

      case 'Accessor':
        /*istanbul ignore else*/
        if (item.setSignature) {
          const setSignature: any = item.setSignature[0];
          const {
            description: setSignatureDescription
          } = this.parseCommentTags(setSignature.comment);
          description = setSignatureDescription;
          typeName = this.parseFormattedType(setSignature.parameters[0].type);
        }
        break;
    }

    return {
      decorator,
      defaultValue,
      deprecationWarning,
      description,
      isOptional: (this.isOptional(item) && decorator === 'Input'),
      name: item.name,
      type: typeName
    };
  }

  private parseClassDefinition(item: any): SkyDocsClassDefinition {
    const properties: SkyDocsPropertyDefinition[] = [];
    const methods: SkyDocsMethodDefinition[] = [];

    item.children.forEach((child: any) => {
      if (child.kindString === 'Property') {
        const {
          description: propertyDescription
        } = this.parseCommentTags(child.comment);

        properties.push({
          defaultValue: this.getDefaultValue(child),
          description: propertyDescription,
          name: child.name,
          type: this.parseFormattedType(child.type)
        });
      }

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

  private parseMethodDefinition(item: any): SkyDocsMethodDefinition {
    const signature: any = item.signatures[0];
    const parameters: SkyDocsParameterDefinition[] = [];

    const typeParameters = this.parseTypeParameters(signature);

    if (signature.parameters) {
      signature.parameters.forEach((p: any) => {
        const defaultValue = this.getDefaultValue(p);
        const parameter: SkyDocsParameterDefinition = {
          defaultValue,
          description: (p.comment) ? p.comment.text.trim() : '',
          isOptional: (defaultValue) ? true : this.isOptional(p),
          name: p.name,
          type: this.parseFormattedType(p.type)
        };

        parameters.push(parameter);
      });
    }

    const {
      codeExample,
      codeExampleLanguage,
      deprecationWarning,
      description
    } = this.parseCommentTags(signature.comment);

    return {
      codeExample,
      codeExampleLanguage,
      deprecationWarning,
      description,
      name: item.name,
      parameters,
      returnType: this.parseFormattedType(signature.type),
      typeParameters
    };
  }

  private parsePipeDefinition(item: any): SkyDocsPipeDefinition {
    const {
      codeExample,
      codeExampleLanguage,
      description
    } = this.parseCommentTags(item.comment);

    const transformMethod = item.children.find((child: any) => {
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
        type: firstParameter.type
      },
      name: item.name,
      parameters
    };
  }

  private parseInterfaceDefinition(item: any): SkyDocsInterfaceDefinition {
    const properties: SkyDocsInterfacePropertyDefinition[] = [];
    const typeParameters = this.parseTypeParameters(item);

    /*istanbul ignore else*/
    if (item.children) {
      item.children.forEach((p: any) => {
        const { description: propertyDescription } = this.parseCommentTags(p.comment);
        const isOptional = this.isOptional(p);
        const typeName = this.parseFormattedType(p.type);
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
        type: indexSignature.type.name
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

  private parseEnumerationDefinition(item: any): SkyDocsEnumerationDefinition {
    const members = item.children.map((p: any) => {
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

  private parseTypeAliasDefinition(item: any): SkyDocsTypeAliasDefinition {
    const {
      description
    } = this.parseCommentTags(item.comment);

    if (item.type.type === 'union') {
      const types = item.type.types.map((t: any) => {
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
        const parameters = callSignature.parameters.map((p: any) => {
          const isOptional = this.isOptional(p);
          const { extras } = this.parseCommentTags(item.comment);
          const tagParam = extras.parameters.find((param: any) => param.name === p.name);

          const parameter: SkyDocsParameterDefinition = {
            description: tagParam.description,
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

  private parseFormattedType(
    typeConfig: {
      elementType?: any;
      name: string;
      type: string;
      typeArguments?: any[];
    }
  ): string {
    let formatted: string;

    if (typeConfig.name) {
      formatted = typeConfig.name;
    } else {
      formatted = 'any';
    }

    if (
      typeConfig.elementType &&
      typeConfig.elementType.type === 'reference'
    ) {
      formatted = this.parseFormattedType(typeConfig.elementType);
    }

    if (typeConfig.typeArguments) {
      const typeArguments = typeConfig.typeArguments.map((typeArgument: any) => {
        return typeArgument.name;
      });

      formatted += `<${typeArguments.join(', ')}>`;
    }

    if (typeConfig.type === 'array') {
      formatted += '[]';
    }

    return formatted;
  }

  private parseCommentTags(comment: any): SkyDocsCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';

    const extras: {
      [key: string]: any
    } = {};

    if (comment) {
      /*istanbul ignore else*/
      if (comment.tags) {
        comment.tags.forEach((tag: any) => {
          switch (tag.tag.toLowerCase()) {
            case 'deprecated':
              /*istanbul ignore else*/
              deprecationWarning = tag.text.trim();
              break;

            case 'default':
            case 'defaultvalue':
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
              extras.parameters = extras.parameters || [];
              extras.parameters.push({
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
      extras
    };
  }

  private parseTypeParameters(item: { typeParameter?: any[] }): string[] {
    let typeParameters: string[] = [];
    if (item.typeParameter) {
      typeParameters = item.typeParameter.map((t: any) => {
        if (t.type && t.type.type === 'reference') {
          return `${t.name} extends ${t.type.name}`;
        }

        return t.name;
      });
    }

    return typeParameters;
  }

  private sortDirectiveProperties(properties: SkyDocsDirectivePropertyDefinition[], key: keyof SkyDocsDirectivePropertyDefinition): void {
    properties.sort((a, b) => {
      if (a[key] > b[key]) {
        return 1;
      }

      if (a[key] < b[key]) {
        return -1;
      }

      return 0;
    });
  }

  /**
   * Cross-browser check if string ends with another string.
   * See: https://www.freecodecamp.org/news/two-ways-to-confirm-the-ending-of-a-string-in-javascript-62b4677034ac/
   */
  private endsWith(haystack: string, needle: string): boolean {
    return (haystack.substr(needle.length * -1) === needle);
  }

  private isOptional(item: any): boolean {
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

  private getDefaultValue(item: any): string {
    const tags = this.parseCommentTags(item.comment);

    let defaultValue: string = tags.defaultValue || item.defaultValue;
    if (defaultValue) {
      defaultValue = defaultValue.replace(/\"/g, '\'');
    }

    return defaultValue;
  }

}
