import {
  expect
} from '@skyux-sdk/testing';

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

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Type definitions format service', () => {

  let definitionsProvider: SkyDocsTypeDefinitionsProvider;
  let anchorLinkService: SkyDocsAnchorLinkService;

  beforeEach(() => {
    definitionsProvider = {
      anchorIds: {
        'FooUser': 'foo-user'
      },
      typeDefinitions: [
        {
          name: 'FooUser'
        }
      ]
    };

    anchorLinkService = new SkyDocsAnchorLinkService(definitionsProvider);
  });

  it('should generate a method signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar'
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(): void'
    );
  });

  it('should generate a method signature with optional params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      parameters: [
        {
          name: 'component',
          type: 'string',
          isOptional: true,
          defaultValue: '\'foobar\''
        },
        {
          name: 'user',
          type: 'User',
          isOptional: true
        }
      ]
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(component: string = \'foobar\', user?: User): void'
    );
  });

  it('should generate a method signature with type params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      parameters: [
        {
          name: 'component',
          type: 'Type<T>',
          isOptional: false
        },
        {
          name: 'user',
          type: 'U',
          isOptional: false
        }
      ],
      returnType: 'string',
      typeParameters: ['T', 'U extends FooUser']
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar<T, U extends FooUser>(component: Type<T>, user: U): string'
    );
  });

  it('should NOT wrap anchor tags around a method\'s known types', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      returnType: 'FooUser',
      parameters: [{
        name: 'user',
        type: 'FooUser',
        isOptional: false
      }]
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(user: FooUser): FooUser'
    );
  });

  it('should generate a parameter signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const paramDef: SkyDocsParameterDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'string'
    };

    const signature = service.getParameterSignature(paramDef);
    expect(signature).toEqual('foobar: string');
  });

  it('should generate an interface signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const interfaceDef: SkyDocsInterfaceDefinition = {
      name: 'Foobar',
      properties: [
        {
          isOptional: false,
          name: 'foo',
          type: 'Type<T>'
        },
        {
          isOptional: true,
          name: 'bar',
          type: 'string'
        }
      ]
    };

    const signature = service.getInterfaceSignature(interfaceDef);
    expect(signature).toEqual('interface Foobar {\n  foo: Type<T>;\n  bar?: string;\n}');
  });

  it('should generate an interface signature with type params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const interfaceDef: SkyDocsInterfaceDefinition = {
      name: 'Foobar',
      properties: [
        {
          isOptional: false,
          name: 'foo',
          type: 'Type<T>'
        }
      ],
      typeParameters: [
        'T',
        'U extends User'
      ]
    };

    const signature = service.getInterfaceSignature(interfaceDef);
    expect(signature).toEqual('interface Foobar<T, U extends User> {\n  foo: Type<T>;\n}');
  });

  it('should generate a property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'string'
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual('foobar: string');
  });

  it('should generate a property signature without a type', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      type: undefined
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual('foobar');
  });

  it('should generate an optional property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: true,
      type: 'string'
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual('foobar?: string');
  });

  it('should generate a property signature with a decorator', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      decorator: 'Input',
      type: 'string'
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual('@Input()<br />foobar: string');
  });

  it('should generate a deprecated property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'click',
      isOptional: true,
      decorator: 'Output',
      type: 'EventEmitter<FooUser>',
      deprecationWarning: 'Do not use this feature.'
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual(
      '@Output()<br /><strike>click</strike>: EventEmitter&lt;<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>&gt;'
    );
  });

  it('should wrap anchor tags around a property\'s known types', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'FooUser'
    };

    const signature = service.getPropertySignature(propertyDef);
    expect(signature).toEqual(
      'foobar: <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  });

  it('should generate a type alias index signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const definition: SkyDocsTypeAliasIndexSignatureDefinition = {
      name: 'foo',
      keyName: '_',
      valueType: 'FooUser'
    };

    const signature = service.getTypeAliasSignature(definition);
    expect(signature).toEqual('type foo = { [_: string]: FooUser }');
  });

  it('should generate a type alias union signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const definition: SkyDocsTypeAliasUnionDefinition = {
      name: 'foo',
      types: ['string', 'boolean', '\'above\'', 'FooUser']
    };

    const signature = service.getTypeAliasSignature(definition);
    expect(signature).toEqual('type foo = string | boolean | \'above\' | FooUser');
  });

  it('should generate a type alias function signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const definition: SkyDocsTypeAliasFunctionDefinition = {
      name: 'foo',
      parameters: [
        {
          name: 'id',
          type: 'number',
          isOptional: false
        }
      ],
      returnType: 'FooUser'
    };

    const signature = service.getTypeAliasSignature(definition);
    expect(signature).toEqual('type foo = (id: number) => FooUser');
  });

});
