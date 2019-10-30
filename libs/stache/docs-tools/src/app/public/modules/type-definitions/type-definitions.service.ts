import {
  Injectable
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsTypeDefinitions,
  SkyDocsPropertyDefinition,
  SkyDocsMethodDefinition,
  SkyDocsParameterDefinition,
  SkyDocsInterfacePropertyDefinition,
  SkyDocsDirectiveDefinition,
  SkyDocsDirectivePropertyDefinition,
  SkyDocsServiceDefinition,
  SkyDocsPipeDefinition,
  SkyDocsInterfaceDefinition,
  SkyDocsEnumerationDefinition,
  SkyDocsTypeAliasDefinition
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

interface SkyDocsTypeDefinitionCommentTags {
  codeExample: string;
  codeExampleLanguage: string;
  defaultValue: string;
  deprecationWarning: string;
  description: string;
  extras?: { [key: string]: string };
}

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider,
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodePath The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(sourceCodePath: string): SkyDocsTypeDefinitions {

    const typeDefinitions = this.typeDefinitionsProvider.typeDefinitions;

    const requestedDir = sourceCodePath.replace(
      /src(\/|\\)app(\/|\\)public(\/|\\)/,
      ''
    );

    const types: SkyDocsTypeDefinitions = {
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: []
    };

    // Only process types that match the requested source code location.
    typeDefinitions.filter((item: any) => {

      const fileName = item.sources[0].fileName;
      return (fileName.match(requestedDir));

    }).forEach((item: any) => {

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
        const definition = this.parseServiceDefinition(item);
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

    if (item.children) {
      item.children.forEach((c: any) => {
        const kindString = c.kindString;

        if (
          kindString === 'Property' ||
          kindString === 'Accessor'
        ) {
          if (!c.decorators) {
            return;
          }

          const decorator = c.decorators[0].name;

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
      name: item.name,
      description,
      selector,
      properties,
      codeExample,
      codeExampleLanguage
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

    switch (kindString) {
      case 'Property':
        description = tags.description;
        typeName = this.parseFormattedType(item.type);
        break;

      case 'Accessor':
        if (item.setSignature) {
          const setSignature: any = item.setSignature[0];
          description = setSignature.comment && setSignature.comment.shortText || '';
          typeName = this.parseFormattedType(setSignature.parameters[0].type);
        }
        break;

      default:
        return;
    }

    return {
      type: typeName,
      name: item.name,
      decorator,
      description,
      defaultValue,
      isOptional: (this.isOptional(item) && decorator === 'Input'),
      deprecationWarning
    };
  }

  private parseServiceDefinition(item: any): SkyDocsServiceDefinition {
    const properties: SkyDocsPropertyDefinition[] = [];
    const methods: SkyDocsMethodDefinition[] = [];

    item.children.forEach((child: any) => {
      if (child.kindString === 'Property') {
        const propertyDescription = (child.comment) ? child.comment.shortText : '';

        properties.push({
          name: child.name,
          type: this.parseFormattedType(child.type),
          description: propertyDescription
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
      name: item.name,
      description,
      properties,
      methods
    };
  }

  private parseMethodDefinition(item: any): SkyDocsMethodDefinition {
    const signature: any = item.signatures[0];
    const parameters: SkyDocsParameterDefinition[] = [];

    if (signature.parameters) {
      signature.parameters.forEach((p: any) => {
        const defaultValue = this.getDefaultValue(p);
        const parameter: SkyDocsParameterDefinition = {
          description: (p.comment) ? p.comment.text : '',
          name: p.name,
          type: this.parseFormattedType(p.type),
          defaultValue,
          isOptional: this.isOptional(p)
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
      deprecationWarning,
      name: item.name,
      description,
      returnType: this.parseFormattedType(signature.type),
      parameters,
      codeExample,
      codeExampleLanguage
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

    let interfaceName = item.name;
    let typeParams = '';

    if (item.typeParameter) {
      const typeParameterNames = item.typeParameter.map((t: any) => t.name);
      typeParams = `<${typeParameterNames.join(', ')}>`;
    }

    let sourceCode: string = `interface ${interfaceName}${typeParams} {`;

    if (item.children) {
      item.children.forEach((p: any) => {
        const propertyDescription = (p.comment) ? p.comment.shortText : '';
        const isOptional = this.isOptional(p);
        const optionalIndicator = (isOptional) ? '?' : '';
        const typeName = this.parseFormattedType(p.type, false);

        sourceCode += `\n  ${p.name}${optionalIndicator}: ${typeName.replace(/\"/g, '\'')};`;

        const property: SkyDocsInterfacePropertyDefinition = {
          type: typeName,
          name: p.name,
          description: propertyDescription,
          isOptional
        };

        properties.push(property);
      });
    }

    sourceCode += '\n}';

    const {
      description
    } = this.parseCommentTags(item.comment);

    return {
      anchorId: item.anchorId,
      name: interfaceName,
      description,
      properties,
      sourceCode
    };
  }

  private parseEnumerationDefinition(item: any): SkyDocsEnumerationDefinition {
    const members = item.children.map((p: any) => {
      return {
        name: `${item.name}.${p.name}`,
        description: (p.comment) ? p.comment.shortText : ''
      };
    });

    return {
      anchorId: item.anchorId,
      name: item.name,
      description: (item.comment) ? item.comment.shortText : '',
      members
    };
  }

  private parseTypeAliasDefinition(item: any): SkyDocsTypeAliasDefinition {
    let sourceCode = `type ${item.name} = `;

    const parameters: any[] = [];

    if (item.type.type === 'union') {
      sourceCode += item.type.types.map((t: any) => {
        if (t.type === 'intrinsic' || t.type === 'reference') {
          return t.name;
        }

        let value = t.value;
        if (t.type === 'stringLiteral') {
          return `'${value}'`;
        } else {
          return value;
        }
      }).join(' | ');
    }

    let returnType: string;

    if (item.type.type === 'reflection') {
      sourceCode += '(';

      if (item.type.declaration.signatures) {
        const callSignature = item.type.declaration.signatures[0];

        sourceCode += callSignature.parameters.map((p: any) => {
          const foundTag = item.comment.tags.find((tag: any) => {
            return (tag.tag === 'param' && tag.param === p.name);
          });

          const isOptional = this.isOptional(p);
          const defaultValue = this.getDefaultValue(p);

          if (foundTag) {
            parameters.push({
              name: p.name,
              type: p.type.name,
              description: foundTag.text,
              defaultValue,
              isOptional
            });
          }

          const optionalIndicator = (isOptional) ? '?' : '';

          return `${p.name}${optionalIndicator}: ${p.type.name}`;

        }).join(', ');

        sourceCode += `) => ${callSignature.type.name}`;
        returnType = callSignature.type.name;
      }
    }

    sourceCode += ';';

    const {
      description
    } = this.parseCommentTags(item.comment);

    return {
      anchorId: item.anchorId,
      name: item.name,
      description,
      sourceCode,
      parameters,
      returnType
    };
  }

  private parseFormattedType(
    typeConfig: {
      name: string;
      type: string;
      elementType?: any;
      typeArguments?: any[];
    },
    escapeCharacters: boolean = true
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

      const lessThan = (escapeCharacters) ? '&lt;' : '<';
      const greaterThan = (escapeCharacters) ? '&gt;' : '>';

      formatted += `${lessThan}${typeArguments.join(', ')}${greaterThan}`;
    }

    if (typeConfig.type === 'array') {
      formatted += '[]';
    }

    return formatted;
  }

  private parseCommentTags(comment: any): SkyDocsTypeDefinitionCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';
    const extras: {[key: string]: string} = {};

    if (comment) {
      if (comment.tags) {
        comment.tags.forEach((tag: any) => {
          switch (tag.tag.toLowerCase()) {
            case 'deprecated':
              if (
                tag.text
              ) {
                deprecationWarning = tag.text.trim();
              }
              break;

            case 'default':
            case 'defaultvalue':
              defaultValue = tag.text.trim();
              break;

            case 'example':
              if (
                tag.text
              ) {
                codeExample = tag.text.trim().split('```')[1].trim();
                const language = codeExample.split('\n')[0];
                if (language === 'markup' || language === 'typescript') {
                  codeExample = codeExample.slice(language.length).trim();
                  codeExampleLanguage = language;
                }
              }
              break;

            default:
              extras[tag.tag] = tag.text;
              break;
          }
        });
      }

      if (comment.shortText) {
        description = this.anchorLinkService.buildAnchorLinks(comment.shortText);
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
    const tags = this.parseCommentTags(item.comment);
    if (tags.extras.required) {
      return false;
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
