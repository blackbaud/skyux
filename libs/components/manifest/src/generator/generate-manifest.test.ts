import path from 'path';

const projectsRootDirectory =
  'libs/components/manifest/src/generator/testing/fixtures/example-packages';

function setup(): { writeFileMock: jest.Mock } {
  jest.spyOn(process.stderr, 'write').mockReturnValue(true);

  const writeFileMock = jest.fn();

  jest.mock('node:fs', () => {
    return {
      existsSync: jest.fn().mockImplementation(() => true),
    };
  });

  jest.mock('node:fs/promises', () => {
    return {
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

  return { writeFileMock };
}

describe('generate-manifest', () => {
  it('should generate manifest', async () => {
    const { writeFileMock } = setup();

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
              anchorId: 'class-foo-internal-class',
              description: 'This is the Foo internal class.',
              filePath: 'src/lib/foo-internal.class.ts',
              isInternal: true,
              kind: 'class',
              name: 'FooInternalClass',
            },
            {
              anchorId: 'type-alias-foo-alias',
              description: 'This is the Foo type alias.',
              filePath: 'src/lib/foo.alias.ts',
              kind: 'type-alias',
              name: 'FooAlias',
              type: "'foo' | true | 0 | undefined | null",
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
                    {
                      name: 'value',
                      type: 'undefined | string',
                    },
                    {
                      defaultValue: 'false',
                      name: 'isThing',
                      type: 'boolean',
                    },
                    {
                      name: 'bar',
                      type: 'boolean',
                    },
                    {
                      isOptional: true,
                      name: 'foo',
                      type: 'string',
                    },
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
});
