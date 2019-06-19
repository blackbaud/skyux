import {
  Injectable
} from '@angular/core';

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

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) { }

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodeLocation The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(sourceCodeLocation: string): SkyDocsTypeDefinitions {
    const typeDefinitions: any = this.typeDefinitionsProvider.typeDefinitions;

    const requestedDir = sourceCodeLocation.replace(
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
    typeDefinitions.children.filter((item: any) => {

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
    const defaultValue: string = tags.defaultValue || item.defaultValue;

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
      isOptional: (!!defaultValue && decorator === 'Input'),
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
        const parameter: SkyDocsParameterDefinition = {
          description: (p.comment) ? p.comment.shortText : '',
          name: p.name,
          type: this.parseFormattedType(p.type),
          defaultValue: p.defaultValue && p.defaultValue.replace(/\"/g, '\''),
          isOptional: (p.flags.isOptional === true || p.defaultValue)
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
    const selector = item.decorators[0].arguments.obj.split('name: \'')[1].split('\'')[0];

    const {
      codeExample,
      codeExampleLanguage,
      description
    } = this.parseCommentTags(item.comment);

    return {
      description,
      name: item.name,
      selector,
      codeExample,
      codeExampleLanguage
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
        const isOptional = (p.flags.isOptional === true);
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
      name: interfaceName,
      description,
      properties,
      sourceCode
    };
  }

  private parseEnumerationDefinition(item: any): SkyDocsEnumerationDefinition {
    const values = item.children.map((p: any) => {
      return {
        name: `${item.name}.${p.name}`,
        description: (p.comment) ? p.comment.shortText : ''
      };
    });

    return {
      name: item.name,
      description: (item.comment) ? item.comment.shortText : '',
      values
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

    if (item.type.type === 'reflection') {
      sourceCode += '(';

      if (item.type.declaration.signatures) {
        const callSignature = item.type.declaration.signatures[0];

        sourceCode += callSignature.parameters.map((p: any) => {
          const foundTag = item.comment.tags.find((tag: any) => {
            return (tag.tag === 'param' && tag.param === p.name);
          });

          if (foundTag) {
            parameters.push({
              name: p.name,
              type: p.type.name,
              description: foundTag.text,
              defaultValue: p.defaultValue,
              isOptional: (p.flags.isOptional === true)
            });
          }

          const optionalIndicator = (p.flags.isOptional === true) ? '?' : '';

          return `${p.name}${optionalIndicator}: ${p.type.name}`;

        }).join(', ');

        sourceCode += `) => ${callSignature.type.name}`;
      }
    }

    sourceCode += ';';

    return {
      name: item.name,
      description: (item.comment) ? item.comment.shortText : '',
      sourceCode,
      parameters
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

  private parseCommentTags(comment: any): any {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';

    if (comment) {
      if (comment.tags) {
        comment.tags.forEach((tag: any) => {
          if (
            tag.tag === 'deprecated' &&
            tag.text
          ) {
            deprecationWarning = tag.text.trim();
          }

          if (
            tag.tag === 'default' ||
            tag.tag === 'defaultvalue'
          ) {
            defaultValue = tag.text.trim();
          }

          if (
            tag.tag === 'example' &&
            tag.text
          ) {
            codeExample = tag.text.trim().split('```')[1].trim();
            const language = codeExample.split('\n')[0];
            if (language === 'markup' || language === 'typescript') {
              codeExample = codeExample.slice(language.length).trim();
              codeExampleLanguage = language;
            }
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
      description
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
}
