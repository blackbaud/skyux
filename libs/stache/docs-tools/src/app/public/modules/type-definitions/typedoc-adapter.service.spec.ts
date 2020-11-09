import {
  SkyDocsTypeDocAdapterService
} from './typedoc-adapter.service';

import {
  TypeDocEntry
} from './typedoc-types';

describe('TypeDoc adapter', () => {

  let adapter: SkyDocsTypeDocAdapterService;

  beforeEach(() => {
    adapter = new SkyDocsTypeDocAdapterService();
  });

  describe('Class definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooClass'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toClassDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooClass'
      });
    });

    it('should convert public properties and order them alphabetically', () => {
      entry.children = [
        {
          name: 'fooB',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'number'
          }
        },
        {
          name: 'fooA',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          }
        },
        {
          name: 'fooB',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic'
          }
        }
      ]);
    });

    it('should list required properties first', () => {
      entry.children = [
        {
          name: 'fooA',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'number'
          }
        },
        {
          name: 'fooZ',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          comment: {
            tags: [{
              tag: 'required',
              text: '\n'
            }]
          }
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooZ',
          isOptional: false,
          type: {
            name: 'string',
            type: 'intrinsic'
          }
        },
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic'
          }
        }
      ]);
    });

    it('should handle property accessors', () => {
      entry.children = [
        {
          name: 'foo',
          kindString: 'Accessor',
          comment: {
            shortText: 'The foo of the FooClass.',
            tags: [
              {
                'tag': 'default',
                'text': '10\n'
              }
            ]
          },
          getSignature: [
            {
              name: '__get',
              comment: {
                shortText: 'The foo of the FooClass.',
                tags: [
                  {
                    'tag': 'default',
                    'text': '10\n'
                  }
                ]
              },
              type: {
                type: 'intrinsic',
                name: 'number'
              }
            }
          ],
          setSignature: [
            {
              name: '__set',
              comment: {
                shortText: 'The foo of the FooClass.',
                tags: [
                  {
                    'tag': 'default',
                    'text': '10\n'
                  }
                ]
              },
              parameters: [
                {
                  name: 'value',
                  kindString: 'Parameter',
                  type: {
                    type: 'intrinsic',
                    name: 'number'
                  }
                }
              ],
              type: {
                type: 'intrinsic',
                name: 'void'
              }
            }
          ]
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number'
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10'
        }
      ]);
    });

    it('should handle properties with only `get` accessors', () => {
      entry.children = [
        {
          name: 'foo',
          kindString: 'Accessor',
          comment: {
            shortText: 'The foo of the FooClass.',
            tags: [
              {
                tag: 'default',
                text: '10\n'
              }
            ]
          },
          getSignature: [
            {
              name: '__get',
              comment: {
                shortText: 'The foo of the FooClass.',
                tags: [
                  {
                    tag: 'default',
                    text: '10\n'
                  }
                ]
              },
              type: {
                type: 'intrinsic',
                name: 'number'
              }
            }
          ]
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number'
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10'
        }
      ]);
    });

    it('should handle union-type properties', () => {
      entry.children = [
        {
          name: 'fooUnion',
          kindString: 'Property',
          type: {
            type: 'union',
            types: [
              {
                type: 'reference',
                name: 'FooUser'
              },
              {
                type: 'intrinsic',
                name: 'string'
              },
              {
                type: 'stringLiteral',
                value: '\'above\''
              }
            ]
          }
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooUnion',
          isOptional: true,
          type: {
            type: 'union',
            unionTypes: [
              {
                type: 'reference',
                name: 'FooUser'
              },
              {
                name: 'string',
                type: 'intrinsic'
              },
              {
                type: 'stringLiteral',
                name: '\'above\''
              }
            ]
          }
        }
      ]);
    });

    it('should convert call signature properties and their metadata', () => {
      entry.children = [{
        name: 'searchFunction',
        kindString: 'Property',
        comment: {
          tags: [
            {
              tag: 'param',
              text: 'The keywords used to search.',
              param: 'searchTerm'
            },
            {
              tag: 'param',
              text: 'The number of milliseconds to wait between each keypress.',
              param: 'debounceTime'
            },
            {
              tag: 'required',
              text: '\n'
            },
            {
              tag: 'deprecated',
              text: 'Search functions should not be used.\n'
            },
            {
              tag: 'example',
              text: '\n```markup\n[searchFunction]="mySearchFunction"\n```\n'
            }
          ]
        },
        decorators: [
          {
            name: 'Input',
            type: {
              type: 'reference',
              name: 'Input'
            },
            arguments: {}
          }
        ],
        type: {
          type: 'reflection',
          declaration: {
            signatures: [
              {
                name: '__call',
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'searchTerm',
                    kindString: 'Parameter',
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  },
                  {
                    name: 'debounceTime',
                    kindString: 'Parameter',
                    flags: {
                      isOptional: true
                    },
                    type: {
                      type: 'intrinsic',
                      name: 'number'
                    }
                  }
                ],
                type: {
                  type: 'array',
                  elementType: {
                    type: 'intrinsic',
                    name: 'any'
                  }
                }
              }
            ]
          }
        }
      }];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          decorator: {
            name: 'Input'
          },
          deprecationWarning: 'Search functions should not be used.',
          name: 'searchFunction',
          type: {
            type: 'reflection',
            callSignature: {
              returnType: {
                type: 'array',
                name: 'any'
              },
              parameters: [
                {
                  isOptional: false,
                  name: 'searchTerm',
                  type: {
                    type: 'intrinsic',
                    name: 'string'
                  },
                  description: 'The keywords used to search.'
                },
                {
                  isOptional: true,
                  name: 'debounceTime',
                  type: {
                    type: 'intrinsic',
                    name: 'number'
                  },
                  description: 'The number of milliseconds to wait between each keypress.'
                }
              ]
            }
          }
        }
      ]);

    });

    it('should convert index signature properties', () => {
      entry.children = [{
        name: 'anchorIds',
        kindString: 'Property',
        type: {
          type: 'reflection',
          declaration: {
            indexSignature: [
              {
                name: '__index',
                kindString: 'Index signature',
                parameters: [
                  {
                    name: '_',
                    kindString: 'Parameter',
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'string'
                }
              }
            ]
          }
        }
      }];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'anchorIds',
          type: {
            type: 'reflection',
            indexSignature: {
              key: {
                name: '_',
                type: {
                  type: 'intrinsic',
                  name: 'string'
                }
              },
              type: {
                type: 'intrinsic',
                name: 'string'
              }
            }
          }
        }
      ]);
    });

    it('should convert public methods and order them alphabetically', () => {
      entry.children = [
        {
          name: 'getB',
          kindString: 'Method',
          signatures: [{
            kindString: 'Call signature',
            name: 'getB',
            type: {
              type: 'intrinsic',
              name: 'string'
            }
          }]
        },
        {
          name: 'getA',
          kindString: 'Method',
          signatures: [{
            kindString: 'Call signature',
            name: 'getA',
            type: {
              type: 'intrinsic',
              name: 'void'
            }
          }]
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getA',
          type: {
            callSignature: {
              returnType: {
                name: 'void',
                type: 'intrinsic'
              }
            },
            name: 'getA'
          }
        },
        {
          name: 'getB',
          type: {
            callSignature: {
              returnType: {
                name: 'string',
                type: 'intrinsic'
              }
            },
            name: 'getB'
          }
        }
      ]);

    });

    it('should handle type parameters on methods', () => {
      entry.children = [
        {
          name: 'getUser',
          kindString: 'Method',
          signatures: [
            {
              name: 'getUser',
              kindString: 'Call signature',
              typeParameter: [
                {
                  name: 'T',
                  kindString: 'Type parameter'
                }
              ],
              type: {
                type: 'typeParameter',
                name: 'T'
              }
            }
          ]
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getUser',
          type: {
            callSignature: {
              returnType: {
                name: 'T',
                type: 'typeParameter'
              }
            },
            name: 'getUser'
          },
          typeParameters: [
            {
              name: 'T'
            }
          ]
        }
      ]);

    });

    it('should convert parameters on methods', () => {
      entry.children = [{
        name: 'getUserById',
        kindString: 'Method',
        signatures: [
          {
            name: 'getUserById',
            kindString: 'Call signature',
            comment: {
              shortText: 'Gets a user from the database.'
            },
            parameters: [
              {
                name: 'id',
                kindString: 'Parameter',
                comment: {
                  text: 'The unique identifier.'
                },
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              },
              {
                name: 'user',
                kindString: 'Parameter',
                type: {
                  type: 'reference',
                  typeArguments: [
                    {
                      type: 'typeParameter',
                      name: 'T'
                    },
                    {
                      type: 'typeParameter',
                      name: 'U',
                      constraint: {
                        name: 'FooUser'
                      }
                    }
                  ],
                  name: 'Foo'
                }
              },
              {
                name: 'locale',
                kindString: 'Parameter',
                comment: {
                  text: 'The locale of the user.\n'
                },
                type: {
                  type: 'intrinsic',
                  name: 'string'
                },
                defaultValue: '"en-US"'
              }
            ],
            type: {
              type: 'reference',
              name: 'FooUser'
            }
          }
        ]
      }];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getUserById',
          description: 'Gets a user from the database.',
          type: {
            callSignature: {
              returnType: {
                name: 'FooUser',
                type: 'reference'
              },
              parameters: [
                {
                  isOptional: false,
                  name: 'id',
                  type: {
                    type: 'reference',
                    name: 'FooUser'
                  },
                  description: 'The unique identifier.'
                },
                {
                  isOptional: false,
                  name: 'user',
                  type: {
                    type: 'reference',
                    name: 'Foo',
                    typeArguments: [
                      {
                        type: 'typeParameter',
                        name: 'T'
                      },
                      {
                        type: 'typeParameter',
                        name: 'U'
                      }
                    ]
                  },
                  typeArguments: [
                    {
                      type: 'typeParameter',
                      name: 'T'
                    },
                    {
                      type: 'typeParameter',
                      name: 'U'
                    }
                  ]
                },
                {
                  isOptional: true,
                  name: 'locale',
                  type: {
                    type: 'intrinsic',
                    name: 'string'
                  },
                  defaultValue: '"en-US"',
                  description: 'The locale of the user.'
                }
              ]
            },
            name: 'getUserById'
          }
        }
      ]);
    });

    it('should convert code examples for properties', () => {
      entry.children = [
        {
          name: 'markupProperty',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'void'
          },
          comment: {
            tags: [{
              tag: 'example',
              text: '\n```markup\n[searchFunction]="mySearchFunction"\n```\n'
            }]
          }
        },
        {
          name: 'typescriptProperty',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'void'
          },
          comment: {
            tags: [{
              tag: 'example',
              text: '\n```typescript\n[searchFunction]="mySearchFunction"\n```\n'
            }]
          }
        },
        {
          name: 'defaultProperty',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'void'
          },
          comment: {
            tags: [{
              tag: 'example',
              text: '\n```\n[searchFunction]="mySearchFunction"\n```\n'
            }]
          }
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          name: 'defaultProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic'
          }
        },
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          name: 'markupProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic'
          }
        },
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'typescript',
          name: 'typescriptProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic'
          }
        }
      ]);
    });

  });

  describe('Directive definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        decorators: [
          {
            name: 'Directive',
            type: {
              type: 'reference',
              name: 'Directive'
            },
            arguments: {
              obj: '{\n  selector: \'[foo]\'\n}'
            }
          }
        ]
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector: '[foo]'
      });
    });

    it('should get selector if wrapped in backticks', () => {
      entry.decorators[0].arguments.obj = '{\n  selector: `input[fooComplex],\n  textarea[fooComplex],\n  [required][fooComplex]`\n}';

      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector: 'input[fooComplex], textarea[fooComplex], [required][fooComplex]'
      });
    });

    it('should convert @Input and @Output properties but ignore all other properties', () => {
      entry.children = [
        {
          name: 'fooB',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'number'
          }
        },
        {
          name: 'fooC',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input'
              }
            }
          ]
        },
        {
          name: 'fooA',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input'
              }
            }
          ]
        },
        {
          name: 'fooD',
          kindString: 'Property',
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'array',
                elementType: {
                  type: 'reference',
                  name: 'FooUser'
                }
              }
            ],
            name: 'EventEmitter'
          },
          defaultValue: 'new EventEmitter<FooUser[]>()',
          decorators: [
            {
              name: 'Output',
              type: {
                type: 'reference',
                name: 'Output'
              }
            }
          ]
        },
        {
          name: 'stream',
          kindString: 'Property',
          decorators: [
            {
              name: 'Output',
              type: {
                type: 'reference',
                name: 'Output'
              },
              arguments: {}
            }
          ],
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'union',
                types: [
                  {
                    type: 'array',
                    elementType: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  },
                  {
                    type: 'reference',
                    typeArguments: [
                      {
                        type: 'array',
                        elementType: {
                          type: 'intrinsic',
                          name: 'string'
                        }
                      }
                    ],
                    name: 'Observable'
                  }
                ]
              }
            ],
            name: 'EventEmitter'
          },
          defaultValue: 'new EventEmitter<Array<string> | Observable<Array<string>>>()'
        }
      ];

      const def = adapter.toDirectiveDefinition(entry);

      expect(def.inputProperties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          },
          decorator: {
            name: 'Input'
          }
        },
        {
          name: 'fooC',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          },
          decorator: {
            name: 'Input'
          }
        }
      ]);

      expect(def.eventProperties).toEqual([
        {
          name: 'fooD',
          isOptional: true,
          type: {
            type: 'reference',
            name: 'EventEmitter',
            typeArguments: [
              {
                type: 'array',
                name: 'FooUser'
              }
            ]
          },
          decorator: {
            name: 'Output'
          },
          defaultValue: 'new EventEmitter<FooUser[]>()'
        },
        {
          isOptional: true,
          name: 'stream',
          type: {
            type: 'reference',
            name: 'EventEmitter',
            typeArguments: [
              {
                type: 'union',
                unionTypes: [
                  {
                    type: 'array',
                    name: 'string'
                  },
                  {
                    type: 'reference',
                    name: 'Observable',
                    typeArguments: [
                      {
                        type: 'array',
                        name: 'string'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          decorator: {
            name: 'Output'
          },
          defaultValue: 'new EventEmitter<Array<string> | Observable<Array<string>>>()'
        }
      ]);
    });

    it('should use an Input\'s binding property name', () => {
      entry.children = [
        {
          name: 'originalPropertyName',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input'
              },
              arguments: {
                bindingPropertyName: 'boundName'
              }
            }
          ]
        }
      ];

      const def = adapter.toDirectiveDefinition(entry);

      expect(def.inputProperties).toEqual([
        {
          name: 'boundName',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          },
          decorator: {
            name: 'Input'
          }
        }
      ]);
    });
  });

  describe('Enumeration definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooEnum'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: []
      });
    });

    it('should convert enumeration members', () => {
      entry.children = [
        {
          name: 'A'
        },
        {
          name: 'B'
        },
        {
          name: 'C'
        }
      ];

      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: [
          {
            name: 'A'
          },
          {
            name: 'B'
          },
          {
            name: 'C'
          }
        ]
      });
    });

  });

  describe('Interface definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooInterface'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toInterfaceDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooInterface',
        properties: []
      });
    });

    it('should convert properties', () => {
      entry.children = [
        {
          name: 'fooB',
          kindString: 'Property',
          flags: {
            isOptional: true
          },
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        },
        {
          name: 'fooA',
          kindString: 'Property',
          flags: {
            isOptional: true
          },
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        },
        {
          name: 'fooZ',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'fooZ',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        },
        {
          isOptional: true,
          name: 'fooA',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        },
        {
          isOptional: true,
          name: 'fooB',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ]);
    });

    it('should support type parameters', () => {
      entry.typeParameter = [
        {
          name: 'T',
          kindString: 'Type parameter'
        },
        {
          name: 'U',
          kindString: 'Type parameter',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ];

      entry.children = [
        {
          name: 'foo',
          kindString: 'Property',
          type: {
            type: 'typeParameter',
            name: 'T'
          }
        },
        {
          name: 'user',
          kindString: 'Property',
          type: {
            type: 'typeParameter',
            name: 'U',
            constraint: {
              name: 'FooUser'
            }
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.typeParameters).toEqual([
        {
          name: 'T'
        },
        {
          name: 'U',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ]);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'foo',
          type: {
            type: 'typeParameter',
            name: 'T'
          }
        },
        {
          isOptional: false,
          name: 'user',
          type: {
            type: 'typeParameter',
            name: 'U'
          }
        }
      ]);
    });

    it('should support index signature properties', () => {
      entry.indexSignature = [
        {
          name: '__index',
          kindString: 'Index signature',
          parameters: [
            {
              name: '_',
              kindString: 'Parameter',
              type: {
                type: 'intrinsic',
                name: 'string'
              }
            }
          ],
          type: {
            type: 'intrinsic',
            name: 'any'
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: '__index',
          type: {
            indexSignature: {
              key: {
                name: '_',
                type: {
                  type: 'intrinsic',
                  name: 'string'
                }
              },
              type: {
                type: 'intrinsic',
                name: 'any'
              }
            }
          }
        }
      ]);

    });

    it('should support type literal properties', () => {
      entry.children = [
        {
          name: 'route',
          kindString: 'Property',
          type: {
            type: 'reflection',
            declaration: {
              children: [
                {
                  name: 'commands',
                  flags: {
                    isOptional: true
                  },
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'intrinsic',
                      name: 'any'
                    }
                  }
                }
              ]
            }
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'route',
          type: {
            type: 'reflection',
            typeLiteral: {
              properties: [
                {
                  isOptional: true,
                  name: 'commands',
                  type: {
                    type: 'array',
                    name: 'any'
                  }
                }
              ]
            }
          }
        }
      ]);
    });

  });

  describe('Pipe definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooPipe',
        decorators: [
          {
            name: 'Pipe',
            type: {
              type: 'reference',
              name: 'Pipe'
            },
            arguments: {
              obj: '{\n  name: \'foo\'\n}'
            }
          }
        ],
        children: [
          {
            name: 'transform',
            kindString: 'Method',
            signatures: [
              {
                name: 'transform',
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'value',
                    kindString: 'Parameter',
                    type: {
                      type: 'reference',
                      name: 'Date'
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'string'
                }
              }
            ]
          }
        ]
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toPipeDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooPipe',
        transformMethod: {
          name: 'transform',
          type: {
            name: 'transform',
            callSignature: {
              parameters: [
                {
                  isOptional: false,
                  name: 'value',
                  type: {
                    type: 'reference',
                    name: 'Date'
                  }
                }
              ],
              returnType: {
                type: 'intrinsic',
                name: 'string'
              }
            }
          }
        }
      });
    });

  });

  describe('Type alias definitions', () => {

    it('should convert union types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          types: [
            {
              type: 'intrinsic',
              name: 'string'
            },
            {
              type: 'reference',
              name: 'FooDate'
            },
            {
              type: 'intrinsic',
              name: 'number'
            },
            {
              type: 'intrinsic',
              name: 'false'
            },
            {
              type: 'unknown',
              name: '1'
            },
            {
              type: 'stringLiteral',
              name: '\'left\''
            },
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser'
              }
            },
            {
              type: 'reflection',
              declaration: {
                signatures: [
                  {
                    name: '__call',
                    kindString: 'Call signature',
                    type: {
                      type: 'intrinsic',
                      name: 'void'
                    }
                  }
                ]
              }
            },
            {
              type: 'typeOperator',
              operator: 'keyof',
              target: {
                name: 'FooUser'
              }
            }
          ]
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          unionTypes: [
            {
              type: 'intrinsic',
              name: 'string'
            },
            {
              type: 'reference',
              name: 'FooDate'
            },
            {
              type: 'intrinsic',
              name: 'number'
            },
            {
              type: 'intrinsic',
              name: 'false'
            },
            {
              type: 'unknown',
              name: '1'
            },
            {
              type: 'stringLiteral',
              name: '\'left\''
            },
            {
              type: 'typeParameter',
              name: 'T'
            },
            {
              type: 'reflection',
              callSignature: {
                returnType: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            },
            {
              type: 'typeOperator',
              name: 'keyof FooUser'
            }
          ]
        }
      });
    });

    it('should convert index signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          declaration: {
            indexSignature: [
              {
                name: '__index',
                kindString: 'Index signature',
                parameters: [
                  {
                    name: '_',
                    kindString: 'Parameter',
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  }
                ],
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              }
            ]
          }
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          indexSignature: {
            key: {
              name: '_',
              type: {
                type: 'intrinsic',
                name: 'string'
              }
            },
            type: {
              type: 'reference',
              name: 'FooUser'
            }
          }
        }
      });
    });

    it('should convert call signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          declaration: {
            signatures: [
              {
                name: '__call',
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'args',
                    kindString: 'Parameter',
                    type: {
                      type: 'reference',
                      name: 'FooUser'
                    }
                  },
                  {
                    name: 'addl',
                    kindString: 'Parameter',
                    type: {
                      type: 'typeParameter',
                      name: 'T'
                    }
                  },
                  {
                    name: 'data',
                    kindString: 'Parameter',
                    type: {
                      type: 'array',
                      elementType: {
                        type: 'intrinsic',
                        name: 'any'
                      }
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            ]
          }
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          callSignature: {
            returnType: {
              type: 'intrinsic',
              name: 'void'
            },
            parameters: [
              {
                isOptional: false,
                name: 'args',
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              },
              {
                isOptional: false,
                name: 'addl',
                type: {
                  type: 'typeParameter',
                  name: 'T'
                }
              },
              {
                isOptional: false,
                name: 'data',
                type: {
                  type: 'array',
                  name: 'any'
                }
              }
            ]
          }
        }
      });
    });

    it('should support type parameters', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        typeParameter: [
          {
            name: 'T',
            kindString: 'Type parameter'
          }
        ],
        type: {
          type: 'union',
          types: [
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser'
              }
            }
          ]
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          unionTypes: [
            {
              type: 'typeParameter',
              name: 'T'
            }
          ]
        },
        typeParameters: [
          {
            name: 'T'
          }
        ]
      });
    });

  });

});
