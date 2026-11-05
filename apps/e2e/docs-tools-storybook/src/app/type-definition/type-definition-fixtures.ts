import type {
  SkyManifestClassDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestDocumentationTypeDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestPipeDefinition,
} from '@skyux/manifest';

const PACKAGE_INFO = {
  packageName: '@skyux/example',
  repoUrl: 'https://github.com/blackbaud/skyux',
  filePath: 'libs/components/example/src/index.ts',
};

const COMPONENT: SkyManifestDirectiveDefinition &
  SkyManifestDocumentationTypeDefinition = {
  ...PACKAGE_INFO,
  anchorId: 'component_sky-example-component',
  docsId: 'SkyExampleComponent',
  kind: 'component',
  name: 'SkyExampleComponent',
  selector: 'sky-example',
  isPreview: true,
  description:
    'Displays an example. Place a `sky-example-item` inside the `sky-example` element, and set `appearance` to a `SkyExampleAppearance` value.',
  children: [
    {
      kind: 'directive-input',
      name: 'heading',
      type: 'string',
      isRequired: true,
      description: 'The text to display as the example heading.',
    },
    {
      kind: 'directive-input',
      name: 'appearance',
      type: 'SkyExampleAppearance',
      defaultValue: "'info'",
      description:
        'The appearance of the example. Valid values are `info`, `success`, and `danger`.',
    },
    {
      kind: 'directive-input',
      name: 'closeable',
      type: 'boolean',
      defaultValue: 'false',
      isDeprecated: true,
      deprecationReason:
        'Use the `closeButtonVisible` input instead. This input will be removed in the next major version.',
      description: 'Whether to display a close button.',
    },
    {
      kind: 'directive-output',
      name: 'closeClick',
      type: 'EventEmitter<SkyExampleCloseArgs>',
      description:
        'Fires when users select the close button. Call `preventDefault()` on the `SkyExampleCloseArgs` to keep the example open.',
    },
  ],
};

const SERVICE: SkyManifestClassDefinition &
  SkyManifestDocumentationTypeDefinition = {
  ...PACKAGE_INFO,
  anchorId: 'class_sky-example-service',
  docsId: 'SkyExampleService',
  kind: 'service',
  name: 'SkyExampleService',
  description: 'Opens and closes examples. Inject it with `inject()`.',
  children: [
    {
      kind: 'class-property',
      name: 'isOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Whether an example is currently open.',
    },
    {
      kind: 'class-method',
      name: 'open',
      type: 'SkyExampleInstance',
      description: 'Opens an example and returns a `SkyExampleInstance`.',
      parameters: [
        {
          name: 'config',
          type: 'SkyExampleConfig',
          description:
            'The configuration for the example, such as `heading` and `appearance`.',
        },
        {
          name: 'timeout',
          type: 'number',
          isOptional: true,
          defaultValue: '5000',
          description: 'The number of milliseconds before the example closes.',
        },
      ],
    },
    {
      kind: 'class-method',
      name: 'closeAll',
      type: 'void',
      isDeprecated: true,
      deprecationReason: 'Call `close()` on each `SkyExampleInstance` instead.',
      description: 'Closes all open examples.',
    },
  ],
};

const MODULE: SkyManifestClassDefinition &
  SkyManifestDocumentationTypeDefinition = {
  ...PACKAGE_INFO,
  anchorId: 'class_sky-example-module',
  docsId: 'SkyExampleModule',
  kind: 'module',
  name: 'SkyExampleModule',
  description: 'Import into any component that uses the `sky-example` element.',
};

const PIPE: SkyManifestPipeDefinition & SkyManifestDocumentationTypeDefinition =
  {
    ...PACKAGE_INFO,
    anchorId: 'pipe_sky-example-format-pipe',
    docsId: 'SkyExampleFormatPipe',
    kind: 'pipe',
    name: 'SkyExampleFormatPipe',
    templateBindingName: 'skyExampleFormat',
    description:
      'Formats a value for display, such as `{{ value | skyExampleFormat }}`.',
    children: [],
  };

const FUNCTION: SkyManifestFunctionDefinition &
  SkyManifestDocumentationTypeDefinition = {
  ...PACKAGE_INFO,
  anchorId: 'function_open-sky-example',
  docsId: 'openSkyExample',
  kind: 'function',
  name: 'openSkyExample',
  type: 'SkyExampleInstance',
  description:
    'Opens an example without injecting `SkyExampleService`, and returns a `SkyExampleInstance`.',
  parameters: [
    {
      name: 'config',
      type: 'SkyExampleConfig',
      isOptional: true,
      description: 'The configuration for the example.',
    },
  ],
};

const INTERFACE: SkyManifestInterfaceDefinition &
  SkyManifestDocumentationTypeDefinition = {
  ...PACKAGE_INFO,
  anchorId: 'interface_sky-example-config',
  docsId: 'SkyExampleConfig',
  kind: 'interface',
  name: 'SkyExampleConfig',
  isDeprecated: true,
  deprecationReason:
    'Pass inputs to `SkyExampleComponent` directly instead of using `SkyExampleConfig`.',
  description: 'Configuration for the `SkyExampleService.open()` method.',
  children: [
    {
      kind: 'interface-property',
      name: 'heading',
      type: 'string',
      description: 'The text to display as the example heading.',
    },
    {
      kind: 'interface-property',
      name: 'appearance',
      type: 'SkyExampleAppearance',
      isOptional: true,
      description: 'The appearance of the example. Defaults to `info`.',
    },
  ],
};

export const DIRECTIVE_DEFINITIONS = [COMPONENT];
export const SERVICE_DEFINITIONS = [SERVICE];
export const OTHER_DEFINITIONS = [MODULE, PIPE, FUNCTION, INTERFACE];

/**
 * Anchor IDs for the types referenced by the fixtures, so the type
 * definitions render them as links.
 */
export const ANCHOR_IDS: Record<string, string> = {
  SkyExampleAppearance: 'type-alias_sky-example-appearance',
  SkyExampleCloseArgs: 'interface_sky-example-close-args',
  SkyExampleInstance: 'class_sky-example-instance',
  ...Object.fromEntries(
    [
      ...DIRECTIVE_DEFINITIONS,
      ...SERVICE_DEFINITIONS,
      ...OTHER_DEFINITIONS,
    ].map((def) => [def.name, def.anchorId]),
  ),
};
