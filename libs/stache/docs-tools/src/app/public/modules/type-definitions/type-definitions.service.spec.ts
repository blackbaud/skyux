import {
  expect
} from '@skyux-sdk/testing';

import * as mockTypeDocJson from './fixtures/mock-documentation.json';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

import {
  SkyDocsTypeAliasFunctionDefinition,
  SkyDocsTypeAliasIndexSignatureDefinition,
  SkyDocsTypeAliasUnionDefinition
} from './type-alias-definition';

describe('Type definitions service', function () {

  let definitionsProvider: SkyDocsTypeDefinitionsProvider;

  beforeEach(() => {
    definitionsProvider = {
      anchorIds: {},
      typeDefinitions: mockTypeDocJson.children
    };
  });

  it('should return type definitions from a specific source code path', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    const result = service.getTypeDefinitions('/src/app/public/modules/_documentation-test/');

    expect(result).toEqual({
      classes: [
        {
          anchorId: 'class-fooclass',
          description: 'This is the description for FooClass.',
          methods: [
            {
              codeExample: undefined,
              codeExampleLanguage: 'markup',
              description: 'This is the description for `getValue()`.',
              name: 'getValue',
              parameters: [],
              returnType: 'string',
              typeParameters: []
            }
          ],
          name: 'FooClass',
          properties: [
            {
              defaultValue: '10',
              description: 'The foo of the FooClass.',
              isOptional: true,
              name: 'foo',
              type: 'number'
            },
            {
              defaultValue: '\'foobar\'',
              description: 'This is the description for `publicProperty`.',
              isOptional: true,
              name: 'publicProperty',
              type: 'string'
            },
            {
              description: '',
              isOptional: true,
              name: 'unionType',
              type: 'FooUser | string'
            },
            {
              description: '',
              isOptional: true,
              name: 'unionTypeEventEmitter',
              type: 'EventEmitter<FooUser | string>'
            }
          ]
        }
      ],
      components: [
        {
          anchorId: 'class-foocomponent',
          codeExample: '<app-foo [baz]="true"></app-foo>',
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooComponent.',
          name: 'FooComponent',
          properties: [
            {
              decorator: 'Input',
              description: '',
              isOptional: false,
              name: 'alphabeticallyFirst',
              type: 'boolean'
            },
            {
              decorator: 'Input',
              defaultValue: 'false',
              description: '',
              isOptional: false,
              name: 'requiredProperty',
              type: 'boolean'
            },
            {
              decorator: 'Input',
              description: '',
              isOptional: false,
              name: 'searchFunction',
              type: {
                callSignature: {
                  returnType: 'any[]',
                  parameters: [
                    {
                      description: '',
                      isOptional: false,
                      name: 'searchTerm',
                      type: 'string'
                    }
                  ]
                }
              }
            },
            {
              decorator: 'Input',
              defaultValue: 'FooEnum.Foo',
              description: 'This is the description for bar input. You must provide `FooEnum` values. If you provide FooEnum.Baz amazing things will happen.',
              isOptional: true,
              name: 'bar',
              type: 'string'
            },
            {
              decorator: 'Input',
              defaultValue: 'false',
              description: 'This is the description for baz input.',
              isOptional: true,
              name: 'baz',
              type: 'boolean'
            },
            {
              decorator: 'Input',
              defaultValue: 'false',
              deprecationWarning: 'This is no longer needed; all new features are available now. Set the `foobar` property on the [[FooPipe]] instead.',
              description: 'Use the latest and greatest features for FooPipe!',
              isOptional: true,
              name: 'experimental',
              type: 'boolean'
            },
            {
              decorator: 'Input',
              description: 'This is the description for foo input. You must provide [[FooEnum]] values.',
              isOptional: true,
              name: 'foo',
              type: 'FooEnum'
            },
            {
              decorator: 'Input',
              description: '',
              isOptional: true,
              name: 'foobarBinding',
              type: 'string'
            },
            {
              decorator: 'Input',
              defaultValue: '\'foobar\'',
              description: '',
              isOptional: true,
              name: 'sample',
              type: 'string'
            },
            {
              decorator: 'Input',
              description: '',
              isOptional: true,
              name: 'user',
              type: 'U'
            },
            {
              decorator: 'Output',
              description: 'Fires when a user is selected.',
              isOptional: true,
              name: 'change',
              type: 'Observable<FooUser>'
            },
            {
              decorator: 'Output',
              description: 'This is the description for the click event.',
              isOptional: true,
              name: 'click',
              type: 'EventEmitter<FooUser>'
            },
            {
              decorator: 'Output',
              deprecationWarning: '',
              description: 'This property doesn\'t include a deprecation message.',
              isOptional: true,
              name: 'newUser',
              type: 'EventEmitter<U>'
            },
            {
              decorator: 'Output',
              description: '',
              isOptional: true,
              name: 'rows',
              type: 'EventEmitter<any[]>'
            }
          ],
          selector: 'app-foo'
        },
        {
          anchorId: 'class-fooemptycomponent',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This component has no properties.',
          name: 'FooEmptyComponent',
          properties: [],
          selector: 'app-foo-empty'
        },
        {
          anchorId: 'class-foousercomponent',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooUserComponent.',
          name: 'FooUserComponent',
          properties: [
            {
              decorator: 'Input',
              description: 'The user, which is a [[FooUser]] value.',
              isOptional: true,
              name: 'user',
              type: 'FooUser'
            },
            {
              decorator: 'Output',
              description: '',
              isOptional: true,
              name: 'save',
              type: 'EventEmitter<FooUser>'
            }
          ],
          selector: 'app-foo-user'
        }
      ],
      directives: [
        {
          anchorId: 'class-foocomplexdirective',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooComplexDirective.',
          name: 'FooComplexDirective',
          properties: [],
          selector: 'input[fooComplex], textarea[fooComplex], [required][fooComplex]'
        },
        {
          anchorId: 'class-foodirective',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooDirective.',
          name: 'FooDirective',
          properties: [
            {
              decorator: 'Input',
              description: '',
              isOptional: true,
              name: 'fooOptions',
              type: 'any'
            }
          ],
          selector: '[foo]'
        }
      ],
      enumerations: [
        {
          anchorId: 'enumeration-fooenum',
          description: 'This is the description for FooEnum. It includes `Date` values.',
          members: [
            {
              description: 'The bar of the foo.',
              name: 'FooEnum.Bar'
            },
            {
              description: 'The baz of the foo.',
              name: 'FooEnum.Baz'
            },
            {
              description: 'The `FooUser` birthday as a `Date` object.',
              name: 'FooEnum.FooUserId'
            }
          ],
          name: 'FooEnum'
        }
      ],
      interfaces: [
        {
          anchorId: 'interface-foo',
          description: 'This is the description for Foo interface.',
          name: 'Foo',
          properties: [
            {
              description: 'This is the description for bar.',
              isOptional: true,
              name: 'bar',
              type: 'T'
            },
            {
              description: 'This is the description for baz.',
              isOptional: true,
              name: 'baz',
              type: 'U'
            },
            {
              description: 'Gets a user from the database.',
              isOptional: false,
              name: 'getUser',
              type: {
                callSignature: {
                  returnType: 'FooUser',
                  parameters: [
                    {
                      description: 'The unique identifier.',
                      isOptional: false,
                      name: 'id',
                      type: 'FooUser'
                    },
                    {
                      description: 'The locale of the user.',
                      isOptional: true,
                      name: 'locale',
                      type: 'string'
                    }
                  ]
                }
              }
            },
            {
              description: '',
              isOptional: true,
              name: 'getUsers',
              type: {
                callSignature: {
                  returnType: 'void',
                  parameters: []
                }
              }
            },
            {
              description: 'Specifies a function to call when users select the text field or button.',
              name: 'open',
              isOptional: true,
              type: {
                callSignature: {
                  parameters: [
                    {
                      description: 'A `FooUser` object that provides values to the custom picker.',
                      isOptional: false,
                      name: 'user',
                      type: 'FooUser'
                    },
                    {
                      description: 'A function that accepts an array of `FooUser` objects that\nrepresent the values selected in the custom picker.',
                      isOptional: false,
                      name: 'updateValue',
                      type: {
                        callSignature: {
                          returnType: 'void',
                          parameters: [
                            {
                              description: '',
                              isOptional: false,
                              name: 'value',
                              type: 'FooUser[]'
                            }
                          ]
                        }
                      }
                    }
                  ],
                  returnType: 'void'
                }
              }
            },
            {
              description: '',
              isOptional: true,
              name: 'user',
              type: 'FooUser'
            },
            {
              description: 'Allow any other properties.',
              isOptional: false,
              name: '[_: string]',
              type: 'any'
            }
          ],
          typeParameters: [ 'T', 'U extends FooUser' ]
        },
        {
          anchorId: 'interface-foodate',
          description: 'This is the description for FooDate.',
          name: 'FooDate',
          properties: [
            {
              description: '',
              isOptional: true,
              name: 'day',
              type: 'number'
            },
            {
              description: '',
              isOptional: true,
              name: 'month',
              type: 'number'
            },
            {
              description: 'The year is optional.',
              isOptional: true,
              name: 'year',
              type: 'number'
            }
          ],
          typeParameters: []
        },
        {
          anchorId: 'interface-foouser',
          description: 'This is the description for FooUser.',
          name: 'FooUser',
          properties: [
            {
              description: 'The user\'s first name.',
              isOptional: true,
              name: 'firstName',
              type: 'string'
            },
            {
              description: 'The user\'s last name.',
              isOptional: true,
              name: 'lastName',
              type: 'string'
            }
          ],
          typeParameters: [ ]
        }
      ],
      pipes: [
        {
          anchorId: 'class-foopipe',
          codeExample: '{{ myDate | foo }}\n{{ myDate | foo:\'medium\' }}\n{{ myDate | foo:\'medium\':\'en-GA\' }}',
          codeExampleLanguage: 'markup',
          description: 'This is the description for the FooPipe.',
          inputValue: {
            description: 'The date to transform.',
            name: 'value',
            type: 'Date'
          },
          name: 'FooPipe',
          parameters: [
            {
              description: 'The date format to use.',
              isOptional: true,
              name: 'format',
              type: 'string'
            },
            {
              description: 'The desired locale.',
              isOptional: true,
              name: 'locale',
              type: 'string'
            }
          ]
        },
        {
          anchorId: 'class-foouserpipe',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This is the description for the FooUserPipe.',
          inputValue: {
            description: '',
            name: 'value',
            type: 'FooUser'
          },
          name: 'FooUserPipe',
          parameters: []
        }
      ],
      services: [
        {
          anchorId: 'class-fooservice',
          description: 'This is the description for FooService.',
          methods: [
            {
              codeExample: undefined,
              codeExampleLanguage: 'markup',
              deprecationWarning: 'Please use `createFoo` input on the [[FooComponent]] instead.',
              description: 'This is the description for anotherFoo().',
              name: 'anotherFoo',
              parameters: [
                {
                  description: 'The component to create.',
                  isOptional: false,
                  name: 'component',
                  type: 'Type<T>'
                },
                {
                  description: 'The user to use.',
                  isOptional: false,
                  name: 'user',
                  type: 'U'
                }
              ],
              returnType: 'void',
              typeParameters: [
                'T',
                'U extends FooUser'
              ]
            },
            {
              codeExample: 'const instance = this.fooService.createFoo(\'baz\');',
              codeExampleLanguage: 'typescript',
              description: 'This is the description for createFoo().',
              name: 'createFoo',
              parameters: [
                {
                  description: '',
                  isOptional: false,
                  name: 'bar',
                  type: 'string'
                },
                {
                  description: '',
                  isOptional: true,
                  name: 'baz',
                  type: 'string'
                },
                {
                  defaultValue: '\'ipsum\'',
                  description: '',
                  isOptional: true,
                  name: 'lorem',
                  type: 'string'
                }
              ],
              returnType: 'string[]',
              typeParameters: []
            }
          ],
          name: 'FooService',
          properties: [
            {
              defaultValue: '[]',
              description: 'This is the description for FOOS.',
              isOptional: true,
              name: 'FOOS',
              type: 'string[]'
            },
            {
              description: 'This is the description for getFoos call signature.',
              isOptional: true,
              name: 'getFoos',
              type: {
                callSignature: {
                  parameters: [],
                  returnType: 'string[]'
                }
              }
            }
          ]
        },
        {
          anchorId: 'class-foouserservice',
          description: 'This is the description for FooUserService.',
          methods: [
            {
              codeExample: undefined,
              codeExampleLanguage: 'markup',
              description: 'This is the description for createFoo(). It creates a [[FooUser]].',
              name: 'getUsers',
              parameters: [],
              returnType: 'FooUser[]',
              typeParameters: []
            }
          ],
          name: 'FooUserService',
          properties: []
        }
      ],
      typeAliases: [
        {
          anchorId: 'type-alias-footypefunction',
          description: 'This is the description for FooTypeFunction.',
          name: 'FooTypeFunction',
          parameters: [
            {
              description: 'The string to find.',
              isOptional: false,
              name: 'needle',
              type: 'string'
            },
            {
              description: 'The string to search.',
              isOptional: true,
              name: 'haystack',
              type: 'string'
            },
            {
              description: undefined,
              isOptional: true,
              name: 'user',
              type: 'FooUser'
            }
          ],
          returnType: 'FooUser'
        } as SkyDocsTypeAliasFunctionDefinition,
        {
          anchorId: 'type-alias-footypeindexsignature',
          description: '',
          name: 'FooTypeIndexSignature',
          keyName: '_',
          valueType: 'FooUser'
        } as SkyDocsTypeAliasIndexSignatureDefinition,
        {
          anchorId: 'type-alias-footypeunioncomplex',
          description: 'This is the description for FooTypeUnionComplex. It can be of type [[FooDate]].',
          name: 'FooTypeUnionComplex',
          types: [ 'string', 'FooDate', 'number', 'false', '1' ]
        } as SkyDocsTypeAliasUnionDefinition,
        {
          anchorId: 'type-alias-footypeunionstring',
          description: 'This is the description for FooTypeUnionString.',
          name: 'FooTypeUnionString',
          types: [ '\'top\'', '\'right\'', '\'bottom\'', '\'left\'' ]
        }
      ]
    });
  });

  it('should return empty type arrays if the path does not include types', () => {
    (definitionsProvider as any).typeDefinitions = undefined;

    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    const result = service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(result).toEqual({
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: []
    });
  });

  it('should warn if the provider does not include types', () => {
    (definitionsProvider as any).typeDefinitions = [];

    const spy = spyOn(console, 'warn');
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(spy).toHaveBeenCalledWith('Type definitions were not found for location: modules/empty/');
  });

  it('should throw an error if the source code path does not end in a slash', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    expect(function () {
      service.getTypeDefinitions('/src/app/public/modules/foobar');
    }).toThrow(
      new Error('The source code path must end with a forward slash (`/`).')
    );
  });

});
