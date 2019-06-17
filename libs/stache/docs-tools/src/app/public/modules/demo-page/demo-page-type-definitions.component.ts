import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import {
  SkyDocsDemoPageTypeDefinitionsProvider
} from './demo-page-type-definitions-provider';

interface DirectiveProperty {
  name: string;
  type: string;
  decorator?: 'Input' | 'Output';
  defaultValue?: string;
  description?: string;
  isOptional?: boolean;
}

interface DirectiveConfig {
  name: string;
  selector: string;
  description?: string;
  properties?: DirectiveProperty[];
}

interface InterfaceProperty {
  name: string;
  type: string;
  description?: string;
  isOptional?: boolean;
}

interface InterfaceConfig {
  name: string;
  properties: InterfaceProperty[];
  sourceCode: string;
  description?: string;
}

interface EnumerationValue {
  name: string;
  description?: string;
}

interface EnumerationConfig {
  name: string;
  description?: string;
  values: EnumerationValue[];
}

interface ServiceProperty {
  name: string;
  type: string;
  description?: string;
}

interface ParameterConfig {
  description: string;
  name: string;
  type: string;
  defaultValue?: string;
  isOptional?: boolean;
}

interface MethodConfig {
  name: string;
  returnType: string;
  description?: string;
  parameters?: ParameterConfig[];
}

interface ServiceConfig {
  name: string;
  description?: string;
  methods?: MethodConfig[];
  properties?: ServiceProperty[];
}

interface TypeAliasConfig {
  name: string;
  sourceCode: string;
  description?: string;
  parameters?: ParameterConfig[];
}

@Component({
  selector: 'sky-docs-demo-page-type-definitions',
  templateUrl: './demo-page-type-definitions.component.html',
  styleUrls: ['./demo-page-type-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageTypeDefinitionsComponent implements OnInit {

  @Input()
  public sourceCodeLocation: string;

  public componentConfigs: DirectiveConfig[] = [];

  public directiveConfigs: DirectiveConfig[] = [];

  public enumerationConfigs: EnumerationConfig[] = [];

  public interfaceConfigs: InterfaceConfig[] = [];

  public serviceConfigs: ServiceConfig[] = [];

  public typeAliasConfigs: TypeAliasConfig[] = [];

  constructor(
    private typeDefinitions: SkyDocsDemoPageTypeDefinitionsProvider
  ) { }

  public ngOnInit(): void {
    const documentation: any = this.typeDefinitions.getTypeDefinitions();

    documentation.children.forEach((item: any) => {

      const directory = item.sources[0].fileName.split('/')[0];
      if (!this.endsWith(this.sourceCodeLocation, directory)) {
        return;
      }

      // Components.
      if (this.endsWith(item.name, 'Component')) {
        const config = this.parseDirectiveConfig(item);
        this.componentConfigs.push(config);
      }

      // Directives.
      if (this.endsWith(item.name, 'Directive')) {
        const config = this.parseDirectiveConfig(item);
        this.directiveConfigs.push(config);
      }

      // Services.
      if (this.endsWith(item.name, 'Service')) {
        const description = (item.comment) ? item.comment.shortText : '';

        const properties: ServiceProperty[] = [];
        const methods: MethodConfig[] = [];

        item.children.forEach((child: any) => {
          if (child.kindString === 'Property') {
            const propertyDescription = (child.comment) ? child.comment.shortText : '';

            if (!propertyDescription) {
              return;
            }

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
            const signature: any = child.signatures[0];

            const parameters: ParameterConfig[] = [];
            if (signature.parameters) {
              signature.parameters.forEach((p: any) => {
                const parameter: ParameterConfig = {
                  description: (p.comment) ? p.comment.shortText : '',
                  name: p.name,
                  type: this.parseFormattedType(p.type),
                  defaultValue: p.defaultValue && p.defaultValue.replace(/\"/g, '\''),
                  isOptional: (p.flags.isOptional === true || p.defaultValue)
                };

                parameters.push(parameter);
              });
            }

            methods.push({
              name: child.name,
              description: (signature.comment) ? signature.comment.shortText : '',
              returnType: this.parseFormattedType(signature.type),
              parameters
            });
          }
        });

        this.serviceConfigs.push({
          name: item.name,
          description,
          properties,
          methods
        });
      }

      // Interfaces.
      if (item.kindString === 'Interface') {
        let properties: InterfaceProperty[] = [];
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

            const property: InterfaceProperty = {
              type: typeName,
              name: p.name,
              description: propertyDescription,
              isOptional
            };

            properties.push(property);
          });
        }

        sourceCode += '\n}';

        // Remove properties that do not have descriptions.
        properties = properties.filter((prop) => prop.description);

        this.interfaceConfigs.push({
          name: interfaceName,
          description: (item.comment) ? item.comment.shortText : '',
          properties,
          sourceCode
        });
      }

      // Enumerations.
      if (item.kindString === 'Enumeration') {
        const values: EnumerationValue[] = item.children.map((p: any) => {
          const value: EnumerationValue = {
            name: `${item.name}.${p.name}`,
            description: (p.comment) ? p.comment.shortText : ''
          };

          return value;
        });

        this.enumerationConfigs.push({
          name: item.name,
          description: (item.comment) ? item.comment.shortText : '',
          values
        });
      }

      // Type aliases.
      if (item.kindString === 'Type alias') {
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

        sourceCode += ';';

        this.typeAliasConfigs.push({
          name: item.name,
          description: (item.comment) ? item.comment.shortText : '',
          sourceCode,
          parameters
        });
      }
    });
  }

  /**
   * Cross-browser check if string ends with another string.
   * See: https://www.freecodecamp.org/news/two-ways-to-confirm-the-ending-of-a-string-in-javascript-62b4677034ac/
   */
  private endsWith(haystack: string, needle: string): boolean {
    return (haystack.substr(needle.length * -1) === needle);
  }

  private parseDirectiveConfig(item: any): DirectiveConfig {
    const selector = item.decorators[0].arguments.obj.split('selector: \'')[1].split('\'')[0];
    const properties: DirectiveProperty[] = [];

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
            let description: string;
            let typeName: string;

            switch (kindString) {
              case 'Property':
                description = c.comment && c.comment.shortText || '';
                typeName = this.parseFormattedType(c.type);
                break;

              case 'Accessor':
                if (c.setSignature) {
                  const setSignature: any = c.setSignature[0];
                  description = setSignature.comment && setSignature.comment.shortText || '';
                  typeName = this.parseFormattedType(setSignature.parameters[0].type);
                }
                break;

              default:
                return;
            }

            properties.push({
              type: typeName,
              name: c.name,
              decorator,
              description
            });
          }
        }
      });
    }

    const config: DirectiveConfig = {
      name: item.name,
      description: (item.comment) ? item.comment.shortText : '',
      selector,
      properties
    };

    return config;
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
}
