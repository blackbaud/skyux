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
              anchorId:
                'variable-should-have-code-example-default-language-comment',
              codeExample: '<h1></h1>',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleDefaultLanguageComment',
              type: 'true',
            },
            {
              anchorId:
                'variable-should-have-code-example-markup-language-comment',
              codeExample: '<br />',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleMarkupLanguageComment',
              type: 'true',
            },
            {
              anchorId:
                'variable-should-have-code-example-unknown-language-comment',
              codeExample: 'const app = express();',
              codeExampleLanguage: 'markup',
              filePath: 'src/lib/comments.ts',
              kind: 'variable',
              name: 'shouldHaveCodeExampleUnknownLanguageComment',
              type: 'true',
            },
            {
              anchorId: 'variable-should-have-deprecated-comment',
              filePath: 'src/lib/comments.ts',
              isDeprecated: true,
              kind: 'variable',
              name: 'shouldHaveDeprecatedComment',
              type: 'true',
            },
            {
              anchorId: 'variable-should-have-deprecated-reason-comment',
              deprecationReason: 'Do something else instead',
              filePath: 'src/lib/comments.ts',
              isDeprecated: true,
              kind: 'variable',
              name: 'shouldHaveDeprecatedReasonComment',
              type: 'true',
            },
            {
              anchorId: 'variable-should-have-internal-comment',
              filePath: 'src/lib/comments.ts',
              isInternal: true,
              kind: 'variable',
              name: 'shouldHaveInternalComment',
              type: 'true',
            },
            {
              anchorId: 'variable-should-have-preview-comment',
              filePath: 'src/lib/comments.ts',
              isPreview: true,
              kind: 'variable',
              name: 'shouldHavePreviewComment',
              type: 'true',
            },
            {
              anchorId: 'class-foo-internal-class',
              description: 'This is the Foo internal class.',
              filePath: 'src/lib/foo-internal.class.ts',
              isInternal: true,
              kind: 'class',
              name: 'FooInternalClass',
            },
            {
              anchorId: 'class-foo-class',
              children: [
                {
                  defaultValue: "'baz'",
                  kind: 'class-property',
                  name: 'bar',
                  type: 'string',
                },
                {
                  description: 'This describes baz.',
                  defaultValue: "'foo'",
                  kind: 'class-property',
                  name: 'baz',
                  type: 'undefined | string',
                },
                {
                  kind: 'class-property',
                  name: 'somethingElse',
                  type: 'undefined | (() => void)',
                },
              ],
              description: 'This is the foo class.',
              filePath: 'src/lib/foo.class.ts',
              kind: 'class',
              name: 'FooClass',
            },
            {
              anchorId: 'class-foo-component',
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
              anchorId: 'type-alias-foo-breakpoint',
              description: 'The name of a viewport or container breakpoint.',
              filePath: 'src/lib/foo.const-assertion.ts',
              kind: 'type-alias',
              name: 'FooBreakpoint',
              type: "'xs' | 'sm' | 'md' | 'lg'",
            },
            {
              anchorId: 'variable-foobreakpoints',
              description: 'A list of all breakpoints.',
              filePath: 'src/lib/foo.const-assertion.ts',
              isInternal: true,
              kind: 'variable',
              name: 'FOO_BREAKPOINTS',
              type: "['xs', 'sm', 'md', 'lg'] as const",
            },
            {
              anchorId: 'class-foo-directive',
              description: 'This is a directive.',
              filePath: 'src/lib/foo.directive.ts',
              kind: 'directive',
              name: 'FooDirective',
              selector: '[foo]',
            },
            {
              anchorId: 'enum-foo-enum',
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
              anchorId: 'function-create-foo',
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
              type: 'FooClass',
            },
            {
              anchorId: 'interface-foo-interface',
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
              anchorId: 'class-foo-module',
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
              anchorId: 'class-foo-pipe',
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
              anchorId: 'class-foo-service',
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
              anchorId: 'type-alias-foo-alias',
              description: 'This is the Foo type alias.',
              filePath: 'src/lib/foo.type-alias.ts',
              kind: 'type-alias',
              name: 'FooAlias',
              type: "'foo' | true | 0 | undefined | null",
            },
            {
              anchorId: 'variable-foovariable',
              description: 'This is a variable.',
              filePath: 'src/lib/foo.variable.ts',
              kind: 'variable',
              name: 'FOO_VARIABLE',
              type: 'InjectionToken<unknown>',
            },
          ],
          '@skyux/foo/testing': [
            {
              anchorId: 'class-sky-foo-harness',
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
