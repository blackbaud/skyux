import path from 'node:path';

const projectsRootDirectory =
  'libs/components/manifest/src/generator/testing/fixtures/example-packages';

function setup(options: { outDirExists: boolean }): {
  mkdirMock: jest.Mock;
  writeFileMock: jest.Mock;
} {
  jest.spyOn(process.stderr, 'write').mockReturnValue(true);

  const mkdirMock = jest.fn();
  const writeFileMock = jest.fn();

  jest.mock('node:fs', () => {
    return {
      existsSync: jest.fn().mockReturnValue(options.outDirExists),
    };
  });

  jest.mock('node:fs/promises', () => {
    return {
      mkdir: mkdirMock,
      writeFile: writeFileMock,
    };
  });

  jest.mock('./get-projects', () => {
    return {
      getProjects: jest.fn().mockImplementation(() => {
        const projectRoot = `${projectsRootDirectory}/foo`;

        return [
          {
            entryPoints: [
              `${projectRoot}/src/index.ts`,
              `${projectRoot}/testing/src/public-api.ts`,
            ],
            packageName: '@skyux/foo',
            projectName: 'foo',
            projectRoot,
          },
        ];
      }),
    };
  });

  return { mkdirMock, writeFileMock };
}

describe('generate-manifest', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should generate manifest', async () => {
    const { writeFileMock } = setup({
      outDirExists: true,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(writeFileMock).toHaveBeenCalledWith(
      path.normalize('/dist/public-api.json'),
      JSON.stringify({
        packages: {
          '@skyux/foo': [
            {
              anchorId: 'class_----',
              description:
                'This describes a class with a name not including letters or numbers.',
              filePath: 'src/lib/anchor-id.ts',
              kind: 'class',
              name: '____',
            },
            {
              anchorId: 'class_foo1',
              description:
                'This describes a class with a name comprising of letters and numbers.',
              filePath: 'src/lib/anchor-id.ts',
              kind: 'class',
              name: 'Foo1',
            },
            {
              anchorId: 'class_foo-with-only-letters',
              description:
                'This describes a class with a name comprising only of letters.',
              filePath: 'src/lib/anchor-id.ts',
              kind: 'class',
              name: 'FooWithOnlyLetters',
            },
            {
              anchorId:
                'variable_should-have-code-example-default-language-comment',
              codeExample: '<h1></h1>',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleDefaultLanguageComment',
              type: 'true',
            },
            {
              anchorId:
                'variable_should-have-code-example-markup-language-comment',
              codeExample: '<br />',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleMarkupLanguageComment',
              type: 'true',
            },
            {
              anchorId:
                'variable_should-have-code-example-unknown-language-comment',
              codeExample: 'const app = express();',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleUnknownLanguageComment',
              type: 'true',
            },
            {
              anchorId: 'variable_should-have-deprecated-comment',
              filePath: 'src/lib/comments.ts',
              isDeprecated: true,
              kind: 'variable',
              name: 'shouldHaveDeprecatedComment',
              type: 'true',
            },
            {
              anchorId: 'variable_should-have-deprecated-reason-comment',
              deprecationReason: 'Do something else instead',
              filePath: 'src/lib/comments.ts',
              isDeprecated: true,
              kind: 'variable',
              name: 'shouldHaveDeprecatedReasonComment',
              type: 'true',
            },
            {
              anchorId: 'variable_should-have-internal-comment',
              filePath: 'src/lib/comments.ts',
              isInternal: true,
              kind: 'variable',
              name: 'shouldHaveInternalComment',
              type: 'true',
            },
            {
              anchorId: 'variable_should-have-preview-comment',
              filePath: 'src/lib/comments.ts',
              isPreview: true,
              kind: 'variable',
              name: 'shouldHavePreviewComment',
              type: 'true',
            },
            {
              anchorId: 'class_foo-base-class',
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooBaseClass',
            },
            {
              anchorId: 'class_foo-basic-type-param-class',
              children: [
                { kind: 'class-property', name: 'ref', type: 'undefined | T' },
              ],
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooBasicTypeParamClass',
              typeParameters: '<T>',
            },
            {
              anchorId: 'class_foo-basic-type-param-default-value-class',
              children: [
                { kind: 'class-property', name: 'ref', type: 'undefined | T' },
              ],
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooBasicTypeParamDefaultValueClass',
              typeParameters: '<T = boolean>',
            },
            {
              anchorId: 'class_foo-class',
              children: [
                {
                  kind: 'class-property',
                  name: 'arrayOfFunctionTypes',
                  type: 'undefined | (() => void)[]',
                },
                {
                  kind: 'class-property',
                  name: 'arrayOfIntrinsicTypes',
                  type: 'undefined | string[]',
                },
                {
                  kind: 'class-property',
                  name: 'arrayOfReflectionTypes',
                  type: 'undefined | { a: boolean; b: string; }[]',
                },
                {
                  kind: 'class-property',
                  name: 'closureType',
                  type: 'undefined | (() => void)',
                },
                {
                  kind: 'class-property',
                  name: 'intrinsicType',
                  type: 'undefined | string',
                },
                {
                  kind: 'class-property',
                  name: 'literalType',
                  type: 'undefined | 0 | 1',
                },
                {
                  kind: 'class-property',
                  name: 'mapType',
                  type: 'undefined | Map<string, number>',
                },
                {
                  kind: 'class-property',
                  name: 'referenceType',
                  type: 'undefined | TClass',
                },
                {
                  kind: 'class-property',
                  name: 'reflectionType',
                  type: 'undefined | { a: boolean; b?: string; }',
                },
                {
                  kind: 'class-property',
                  name: 'unionType',
                  type: "undefined | null | true | 'a' | 'b'",
                },
              ],
              description: 'This is the foo class.',
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooClass',
              typeParameters: '<TClass extends FooBaseClass>',
            },
            {
              anchorId: 'class_foo-with-static-properties-class',
              children: [
                {
                  description: 'This describes the static method.',
                  isStatic: true,
                  kind: 'class-method',
                  name: 'someStaticMethod',
                  parameters: [],
                  type: 'boolean',
                },
                {
                  description: 'This describes the static property.',
                  defaultValue: 'false',
                  isStatic: true,
                  kind: 'class-property',
                  name: 'someStaticProperty',
                  type: 'boolean',
                },
              ],
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooWithStaticPropertiesClass',
            },
            {
              anchorId: 'class_foo-component',
              children: [
                {
                  description: 'This describes the bar input.',
                  defaultValue: "'baz'",
                  kind: 'directive-input',
                  name: 'bar',
                  type: 'undefined | string',
                  isRequired: true,
                },
                {
                  description: 'This describes the foo input.',
                  kind: 'directive-input',
                  name: 'foo',
                  type: 'InputSignal<undefined | string>',
                },
                {
                  description: 'This describes the fooRequired input.',
                  kind: 'directive-input',
                  name: 'fooRequired',
                  type: 'InputSignal<string>',
                },
                {
                  description: 'This describes the onClick output.',
                  kind: 'directive-output',
                  name: 'onClick',
                  type: 'OutputEmitterRef<void>',
                },
                {
                  description: 'This describes the onTouch output.',
                  kind: 'directive-output',
                  name: 'onTouch',
                  type: 'EventEmitter<void>',
                },
              ],
              filePath: 'src/lib/foo.component.ts',
              kind: 'component',
              name: 'FooComponent',
              selector: 'lib-foo',
            },
            {
              anchorId: 'type-alias_foo-breakpoint',
              description: 'The name of a viewport or container breakpoint.',
              filePath: 'src/lib/foo.const-assertion.ts',
              kind: 'type-alias',
              name: 'FooBreakpoint',
              type: "'xs' | 'sm' | 'md' | 'lg'",
            },
            {
              anchorId: 'variable_foo-breakpoints',
              description: 'A list of all breakpoints.',
              filePath: 'src/lib/foo.const-assertion.ts',
              isInternal: true,
              kind: 'variable',
              name: 'FOO_BREAKPOINTS',
              type: "['xs', 'sm', 'md', 'lg'] as const",
            },
            {
              anchorId: 'class_foo-directive',
              description: 'This is a directive without any inputs/outputs.',
              filePath: 'src/lib/foo.directive.ts',
              kind: 'directive',
              name: 'FooDirective',
              selector: '[foo]',
            },
            {
              anchorId: 'class_foo-with-inputs-outputs-directive',
              children: [
                {
                  description: 'This describes a decorated input.',
                  defaultValue: 'true',
                  kind: 'directive-input',
                  name: 'inputA',
                  type: 'boolean',
                  isRequired: true,
                },
                {
                  description: 'This describes a signal input.',
                  defaultValue: 'true',
                  kind: 'directive-input',
                  name: 'inputB',
                  type: 'InputSignal<boolean>',
                },
                {
                  description: 'This describes an input with a setter.',
                  defaultValue: 'true',
                  kind: 'directive-input',
                  name: 'inputC',
                  type: 'boolean',
                  isRequired: true,
                },
                {
                  description: 'This describes an input with a getter.',
                  defaultValue: 'false',
                  kind: 'directive-input',
                  name: 'inputD',
                  type: 'boolean',
                  isRequired: true,
                },
                {
                  description: 'This describes a decorated output.',
                  kind: 'directive-output',
                  name: 'outputA',
                  type: 'EventEmitter<void>',
                },
                {
                  description: 'This describes a signal output.',
                  kind: 'directive-output',
                  name: 'outputB',
                  type: 'OutputEmitterRef<void>',
                },
              ],
              filePath: 'src/lib/foo.directive.ts',
              kind: 'directive',
              name: 'FooWithInputsOutputsDirective',
              selector: '[foo]',
            },
            {
              anchorId: 'enum_foo-enum',
              description: 'This describes the Foo enum.',
              filePath: 'src/lib/foo.enum.ts',
              kind: 'enumeration',
              children: [
                {
                  description: 'This is the Bar value.',
                  kind: 'enum-member',
                  name: 'Bar',
                  type: '0',
                },
                {
                  description: 'This is the Baz value.',
                  kind: 'enum-member',
                  name: 'Baz',
                  type: '1',
                },
              ],
              name: 'FooEnum',
            },
            {
              anchorId: 'function_create-foo',
              description: 'This describes the createFoo function.',
              filePath: 'src/lib/foo.function.ts',
              kind: 'function',
              name: 'createFoo',
              parameters: [
                {
                  description: 'This describes param1.',
                  name: 'param1',
                  type: 'T',
                },
                {
                  defaultValue: 'false',
                  description: 'This describes param2.',
                  name: 'param2',
                  type: 'boolean',
                },
                {
                  description: 'This describes param3.',
                  isOptional: true,
                  name: 'param3',
                  type: 'number',
                },
              ],
              type: 'FooClass<T>',
            },
            {
              anchorId: 'interface_foo-empty-interface',
              filePath: 'src/lib/foo.interface.ts',
              kind: 'interface',
              name: 'FooEmptyInterface',
            },
            {
              anchorId: 'interface_foo-interface',
              children: [
                {
                  isOptional: true,
                  kind: 'interface-property',
                  name: 'bar',
                  type: 'A',
                },
                {
                  description: 'This describes baz.',
                  kind: 'interface-property',
                  name: 'baz',
                  type: 'B',
                },
              ],
              description: 'This is the Foo interface.',
              filePath: 'src/lib/foo.interface.ts',
              indexSignatures: [
                {
                  description: 'This describes the index signature.',
                  name: '[_: string]',
                  type: 'unknown',
                  parameters: [
                    {
                      description: 'The name of the thing.',
                      name: '_',
                      type: 'string',
                    },
                  ],
                },
              ],
              kind: 'interface',
              name: 'FooInterface',
            },
            {
              anchorId: 'class_foo-module',
              children: [
                {
                  kind: 'class-method',
                  name: 'forRoot',
                  parameters: [],
                  type: 'ModuleWithProviders<FooModule>',
                },
              ],
              filePath: 'src/lib/foo.module.ts',
              kind: 'module',
              name: 'FooModule',
            },
            {
              anchorId: 'class_foo-pipe',
              children: [
                {
                  description: 'This describes the transform method.',
                  kind: 'class-method',
                  name: 'transform',
                  parameters: [
                    { name: 'value', type: 'undefined | string' },
                    { defaultValue: 'false', name: 'isThing', type: 'boolean' },
                    { name: 'bar', type: 'boolean' },
                    { isOptional: true, name: 'foo', type: 'string' },
                  ],
                  type: 'string',
                },
              ],
              description: 'This describes the Foo pipe.',
              filePath: 'src/lib/foo.pipe.ts',
              kind: 'pipe',
              name: 'FooPipe',
              templateBindingName: 'foo',
            },
            {
              anchorId: 'class_foo-service',
              children: [
                {
                  defaultValue: "''",
                  kind: 'class-property',
                  name: 'foo',
                  type: 'string',
                },
              ],
              description:
                'This describes the foo service and everything it does.',
              filePath: 'src/lib/foo.service.ts',
              kind: 'service',
              name: 'FooService',
            },
            {
              anchorId: 'type-alias_foo-alias',
              description: 'This is the Foo type alias.',
              filePath: 'src/lib/foo.type-alias.ts',
              kind: 'type-alias',
              name: 'FooAlias',
              type: "'foo' | true | 0 | undefined | null",
            },
            {
              anchorId: 'variable_foo-variable',
              description: 'This is a variable.',
              filePath: 'src/lib/foo.variable.ts',
              kind: 'variable',
              name: 'FOO_VARIABLE',
              type: 'InjectionToken<unknown>',
            },
          ],
          '@skyux/foo/testing': [
            {
              anchorId: 'class_sky-foo-harness',
              description:
                'Harness for interacting with a foo component in tests.',
              filePath: 'testing/src/foo-harness.ts',
              kind: 'class',
              name: 'SkyFooHarness',
            },
          ],
        },
      }),
    );
  });

  it('should create the out directory if it does not exist', async () => {
    const { mkdirMock } = setup({
      outDirExists: false,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(mkdirMock).toHaveBeenCalledWith('/dist');
  });
});
