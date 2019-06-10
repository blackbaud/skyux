import {
  Component,
  OnInit
} from '@angular/core';

// Run `npm run typedoc`.
const documentation: any = require('../../../../docs/documentation.json');

export interface DirectiveProperty {
  name: string;
  type: string;
  decorator?: 'Input' | 'Output';
  defaultValue?: string;
  description?: string;
  isOptional?: boolean;
}

export interface DirectiveConfig {
  name: string;
  selector: string;
  description?: string;
  properties?: DirectiveProperty[];
}

export interface InterfaceProperty {
  name: string;
  type: string;
  description?: string;
  isOptional?: boolean;
}

export interface InterfaceConfig {
  name: string;
  properties: InterfaceProperty[];
  sourceCode: string;
  description?: string;
}

export interface EnumerationValue {
  name: string;
  description?: string;
}

export interface EnumerationConfig {
  name: string;
  description?: string;
  values: EnumerationValue[];
}

export interface ServiceProperty {
  name: string;
  type: string;
  description?: string;
}

export interface ParameterConfig {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
  isOptional?: boolean;
}

export interface MethodConfig {
  name: string;
  returnType: string;
  description?: string;
  parameters?: ParameterConfig[];
}

export interface ServiceConfig {
  name: string;
  description?: string;
  methods?: MethodConfig[];
  properties?: ServiceProperty[];
}

@Component({
  selector: 'app-typedoc',
  templateUrl: './typedoc.component.html'
})
export class AppTypeDocComponent implements OnInit {

  public componentConfigs: DirectiveConfig[] = [];

  public directiveConfigs: DirectiveConfig[] = [];

  public interfaceConfigs: InterfaceConfig[] = [];

  public typeAliasConfigs: {}[] = [];

  public enumerationConfigs: EnumerationConfig[] = [];

  public serviceConfigs: ServiceConfig[] = [];

  public ngOnInit(): void {
    documentation.children.forEach((item: any) => {

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
            properties.push({
              name: child.name,
              type: this.getFormattedType(child.type),
              description: (child.comment) ? child.comment.shortText : ''
            });
          }

          if (child.kindString === 'Method' && child.name.indexOf('ng') !== 0) {
            const signature: any = child.signatures[0];

            const parameters: ParameterConfig[] = (signature.parameters) ? signature.parameters.map((p: any) => {
              const parameter: ParameterConfig = {
                name: p.name,
                type: p.type.name,
                defaultValue: p.defaultValue && p.defaultValue.replace(/\"/g, '\''),
                isOptional: (p.flags.isOptional === true || p.defaultValue)
              };
              return parameter;
            }) : [];

            methods.push({
              name: child.name,
              description: (child.comment) ? child.comment.shortText : '',
              returnType: this.getFormattedType(signature.type),
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
        let sourceCode: string = `interface ${item.name} {`;

        const properties: InterfaceProperty[] = item.children.map((p: any) => {
          const isOptional = (p.flags.isOptional === true);
          const optionalIndicator = (isOptional) ? '?' : '';
          const type = p.type.name;

          sourceCode += `\n  ${p.name}${optionalIndicator}: ${type.replace(/\"/g, '\'')};`;

          const prop: InterfaceProperty = {
            type,
            name: p.name,
            description: (p.comment) ? p.comment.shortText : '',
            isOptional
          };

          return prop;
        });

        sourceCode += '\n}';

        this.interfaceConfigs.push({
          name: item.name,
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
          description: item.comment.shortText,
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
        if (c.kindString === 'Property') {

          const decorator = c.decorators[0].name;

          if (
            decorator === 'Input' ||
            decorator === 'Output'
          ) {
            const description = c.comment && c.comment.shortText || '';
            let type = c.type.name;

            if (c.type.typeArguments) {
              const typeArguments = c.type.typeArguments.map((typeArgument: any) => {
                return typeArgument.name;
              });

              type += `<${typeArguments.join(', ')}>`;
            }

            properties.push({
              type,
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
      description: item.comment.shortText,
      selector,
      properties
    };

    return config;
  }

  private getFormattedType(type: {
    type: string;
    elementType?: {
      type: string;
      name: string;
    };
    name?: string;
  }): string {
    if (type.type === 'array') {
      return `${type.elementType.name}[]`;
    }

    return type.name;
  }
}
