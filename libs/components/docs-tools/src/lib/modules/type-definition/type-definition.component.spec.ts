import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import type {
  SkyManifestClassDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestDocumentationTypeDefinition,
  SkyManifestEnumerationDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestParentDefinitionKind,
  SkyManifestPipeDefinition,
  SkyManifestTypeAliasDefinition,
} from '@skyux/manifest';

import { BehaviorSubject } from 'rxjs';

import { SkyDocsHeadingAnchorLink } from '../heading-anchor/heading-anchor-link';
import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';

import { SkyDocsTypeDefinitionAnchorIdsService } from './type-anchor-ids.service';
import { SkyDocsTypeDefinitionComponent } from './type-definition.component';

const PACKAGE_INFO = {
  filePath: 'libs/components/example/src/index.ts',
  packageName: '@skyux/example',
  repoUrl: 'https://github.com/blackbaud/skyux',
};

const ANCHOR_IDS: Record<string, string> = {
  SkyExampleAppearance: 'type-alias_sky-example-appearance',
  SkyExampleConfig: 'interface_sky-example-config',
  SkyExampleInstance: 'class_sky-example-instance',
};

describe('Type definition component', () => {
  let fixture: ComponentFixture<SkyDocsTypeDefinitionComponent>;
  let queryParams: BehaviorSubject<Params>;

  function createDefinition<T extends object>(
    kind: SkyManifestParentDefinitionKind,
    name: string,
    overrides?: T,
  ): SkyManifestDocumentationTypeDefinition & T {
    return {
      ...PACKAGE_INFO,
      anchorId: `${kind}_${name}`,
      docsId: name,
      kind,
      name,
      ...(overrides as T),
    };
  }

  function getElement(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function getTexts(selector: string): string[] {
    return Array.from(getElement().querySelectorAll(selector)).map(
      (el) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    );
  }

  function getSnippetText(): string | undefined {
    return getTexts('sky-docs-code-snippet code')[0];
  }

  function getLinks(selector: string): string[] {
    return Array.from(
      getElement().querySelectorAll<HTMLAnchorElement>(
        `${selector} a.sky-docs-codespan-anchor`,
      ),
    ).map((link) => `${link.textContent}${link.hash}`);
  }

  async function render(
    definition: SkyManifestDocumentationTypeDefinition,
  ): Promise<void> {
    fixture.componentRef.setInput('definition', definition);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    queryParams = new BehaviorSubject<Params>({});

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams } },
        SkyDocsHeadingAnchorService,
        SkyDocsTypeDefinitionAnchorIdsService,
      ],
    });

    TestBed.inject(SkyDocsTypeDefinitionAnchorIdsService).updateAnchorIds(
      ANCHOR_IDS,
    );

    fixture = TestBed.createComponent(SkyDocsTypeDefinitionComponent);
  });

  describe('heading', () => {
    it('should register a heading anchor for the definition', async () => {
      let links: SkyDocsHeadingAnchorLink[] = [];

      TestBed.inject(SkyDocsHeadingAnchorService).anchorsChange.subscribe(
        (value) => (links = value),
      );

      await render(createDefinition('service', 'SkyExampleService'));

      expect(links.map((link) => [link.anchorId, link.text])).toEqual([
        ['service_SkyExampleService', 'SkyExampleService'],
      ]);

      fixture.destroy();

      expect(links).toEqual([]);
    });

    for (const [kind, color, label] of [
      ['class', 'blue', 'Class'],
      ['component', 'orange', 'Component'],
      ['directive', 'yellow', 'Directive'],
      ['enumeration', 'light-blue', 'Enumeration'],
      ['function', 'blue', 'Function'],
      ['interface', 'light-blue', 'Interface'],
      ['module', 'purple', 'Module'],
      ['pipe', 'blue', 'Pipe'],
      ['service', 'teal', 'Service'],
      ['type-alias', 'light-blue', 'Type alias'],
      ['variable', 'light-blue', 'Variable'],
    ] as const) {
      it(`should render the category tag for a ${kind}`, async () => {
        await render(createDefinition(kind, 'SkyExample', { type: 'string' }));

        expect(
          getElement().querySelector('sky-docs-category-tag'),
        ).toHaveCssClass(`sky-docs-category-tag-color-${color}`);
        expect(getTexts('sky-docs-category-tag')[0]).toBe(`Type: ${label}`);
      });
    }

    it('should render the preview tag and deprecation reason', async () => {
      await render(
        createDefinition('class', 'SkyExampleLegacy', {
          deprecationReason: 'Use `SkyExampleInstance` instead.',
          isDeprecated: true,
          isPreview: true,
        }),
      );

      expect(getTexts('sky-docs-category-tag')).toEqual([
        'Type: Class',
        'Preview',
      ]);
      expect(getTexts('sky-docs-deprecation-reason')).toEqual([
        'Warning: Deprecated. Use SkyExampleInstance instead.',
      ]);
      expect(getLinks('sky-docs-deprecation-reason')).toEqual([
        'SkyExampleInstance#class_sky-example-instance',
      ]);
    });

    it('should render the description and code example', async () => {
      await render(
        createDefinition('class', 'SkyExampleFormatter', {
          codeExample: '<sky-example />',
          description:
            'Formats a `SkyExampleConfig`. Does not modify `SkyExampleFormatter`.',
        }),
      );

      expect(getTexts('sky-docs-type-definition-description')).toEqual([
        'Formats a SkyExampleConfig. Does not modify SkyExampleFormatter.',
      ]);
      expect(getLinks('sky-docs-type-definition-description')).toEqual([
        'SkyExampleConfig#interface_sky-example-config',
      ]);
      expect(getSnippetText()).toBe('<sky-example />');
    });
  });

  describe('imports', () => {
    it('should render the import statement for modules and harnesses', async () => {
      await render(createDefinition('module', 'SkyExampleModule'));

      expect(getTexts('sky-code')).toEqual([
        "import { SkyExampleModule } from '@skyux/example';",
      ]);

      await render(createDefinition('class', 'SkyExampleHarness'));

      expect(getTexts('sky-code')).toEqual([
        "import { SkyExampleHarness } from '@skyux/example';",
      ]);

      await render(createDefinition('class', 'SkyExampleInstance'));

      expect(getTexts('sky-code')).toEqual([]);
    });
  });

  describe('functions', () => {
    it('should link types in the signature and parameters', async () => {
      await render(
        createDefinition<Partial<SkyManifestFunctionDefinition>>(
          'function',
          'openSkyExample',
          {
            type: 'SkyExampleInstance',
            parameters: [
              {
                name: 'config',
                type: 'SkyExampleConfig',
                isOptional: true,
                description: 'The configuration for the example.',
              },
              { name: 'timeout', type: 'number', defaultValue: '5000' },
            ],
          },
        ),
      );

      expect(getSnippetText()).toBe(
        'function openSkyExample(config?: SkyExampleConfig, timeout = 5000): SkyExampleInstance',
      );
      expect(getLinks('sky-docs-code-snippet')).toEqual([
        'SkyExampleConfig#interface_sky-example-config',
        'SkyExampleInstance#class_sky-example-instance',
      ]);
      expect(getTexts('h3')).toEqual(['Parameters']);
      expect(getTexts('h4')).toEqual([
        'config?: SkyExampleConfig',
        'timeout = 5000',
      ]);
      expect(getTexts('sky-docs-type-definition-description')).toEqual([
        'The configuration for the example.',
      ]);
    });

    it('should render an async function without parameters', async () => {
      await render(
        createDefinition('function', 'loadSkyExample', {
          type: 'Promise<void>',
        }),
      );

      expect(getSnippetText()).toBe(
        'async function loadSkyExample(): Promise<void>',
      );
      expect(getTexts('h3')).toEqual([]);
    });
  });

  describe('directives', () => {
    it('should render the selector, inputs, and outputs', async () => {
      await render(
        createDefinition<Partial<SkyManifestDirectiveDefinition>>(
          'component',
          'SkyExampleComponent',
          {
            selector: 'sky-example',
            children: [
              {
                kind: 'directive-input',
                name: 'closeable',
                type: 'boolean',
                defaultValue: 'false',
                isDeprecated: true,
                deprecationReason: 'Use `closeButtonVisible` instead.',
              },
              {
                kind: 'directive-input',
                name: 'heading',
                type: 'string',
                isRequired: true,
                description: 'The heading.',
              },
              {
                kind: 'directive-input',
                name: 'size',
                type: 'SkyExampleAppearance',
                defaultValue: "'info'",
              },
              {
                kind: 'directive-input',
                name: 'ariaLabel',
                type: 'string',
                isRequired: true,
              },
              {
                kind: 'directive-output',
                name: 'closeClick',
                type: 'EventEmitter<SkyExampleConfig>',
                isDeprecated: true,
                deprecationReason: 'Subscribe to `closed` instead.',
                description: 'Fires when users select the close button.',
              },
            ],
          },
        ),
      );

      expect(getTexts('p')).toContain('Selector: sky-example');
      expect(getTexts('h3')).toEqual(['Inputs', 'Outputs']);
      expect(getTexts('.sky-docs-type-definition-box-heading')).toEqual([
        'ariaLabel: string',
        'heading: string',
        'closeable: boolean',
        'size: SkyExampleAppearance',
        'closeClick: EventEmitter<SkyExampleConfig>',
      ]);
      expect(
        getTexts(
          '.sky-docs-type-definition-box-header:has(sky-docs-category-tag) .sky-docs-type-definition-box-heading',
        ),
      ).toEqual(['ariaLabel: string', 'heading: string']);
      expect(getLinks('sky-docs-type-definition-box')).toEqual([
        'SkyExampleAppearance#type-alias_sky-example-appearance',
        'SkyExampleConfig#interface_sky-example-config',
      ]);
      expect(
        getTexts('sky-docs-type-definition-box p').filter((text) =>
          text.startsWith('Default:'),
        ),
      ).toEqual(['Default: false', "Default: 'info'"]);
      expect(getTexts('sky-docs-deprecation-reason')).toEqual([
        'Warning: Deprecated. Use closeButtonVisible instead.',
        'Warning: Deprecated. Subscribe to closed instead.',
      ]);
      expect(
        getElement().querySelectorAll(
          '.sky-docs-type-definition-box-heading .sky-docs-text-strikethrough',
        ).length,
      ).toBe(2);
    });

    it('should not render empty input and output sections', async () => {
      await render(
        createDefinition<Partial<SkyManifestDirectiveDefinition>>(
          'directive',
          'SkyExampleDirective',
          { children: [] },
        ),
      );

      expect(getTexts('h3')).toEqual([]);
    });
  });

  describe('classes', () => {
    it('should render properties and methods', async () => {
      await render(
        createDefinition<Partial<SkyManifestClassDefinition>>(
          'service',
          'SkyExampleService',
          {
            children: [
              {
                kind: 'class-property',
                name: 'isOpen',
                type: 'boolean',
                defaultValue: 'false',
                isDeprecated: true,
                deprecationReason: 'Check `SkyExampleInstance` instead.',
                description: 'Whether an example is open.',
                codeExample: 'service.isOpen;',
                codeExampleLanguage: 'typescript',
              },
              {
                kind: 'class-property',
                name: 'defaults',
                type: 'SkyExampleConfig',
                isStatic: true,
              },
              {
                kind: 'class-method',
                name: 'open',
                type: 'SkyExampleInstance',
                description: 'Opens an example.',
                parameters: [
                  {
                    name: 'config',
                    type: 'SkyExampleConfig',
                    description: 'The configuration.',
                  },
                ],
              },
              {
                kind: 'class-method',
                name: 'closeAll',
                type: 'void',
                isStatic: true,
                isDeprecated: true,
                deprecationReason: 'Close each example instead.',
              },
            ],
          },
        ),
      );

      expect(getTexts('h3')).toEqual(['Properties', 'Methods']);
      expect(getTexts('.sky-docs-type-definition-box-heading')).toEqual([
        'isOpen: boolean',
        'static defaults: SkyExampleConfig',
        'open(config: SkyExampleConfig): SkyExampleInstance',
        'SkyExampleService.closeAll(): void',
      ]);
      expect(getTexts('sky-docs-type-definition-box h5')).toEqual([
        'Example',
        'config: SkyExampleConfig',
      ]);
      expect(getSnippetText()).toBe('service.isOpen;');
      expect(getTexts('.sky-docs-type-definition-box-body h4')).toEqual([
        'Parameters',
        'Returns',
        'Returns',
      ]);
      expect(getLinks('.sky-docs-type-definition-box-body > p')).toEqual([
        'SkyExampleInstance#class_sky-example-instance',
      ]);
    });

    it('should render the pipe name', async () => {
      await render(
        createDefinition<Partial<SkyManifestPipeDefinition>>(
          'pipe',
          'SkyExampleFormatPipe',
          { templateBindingName: 'skyExampleFormat', children: [] },
        ),
      );

      expect(getTexts('p')).toContain('Pipe name: skyExampleFormat');
      expect(getTexts('h3')).toEqual([]);
    });
  });

  describe('types', () => {
    it('should render an interface', async () => {
      await render(
        createDefinition<Partial<SkyManifestInterfaceDefinition>>(
          'interface',
          'SkyExampleConfig',
          {
            children: [
              { kind: 'interface-property', name: 'heading', type: 'string' },
              {
                kind: 'interface-property',
                name: 'appearance',
                type: 'SkyExampleAppearance',
                isOptional: true,
              },
            ],
          },
        ),
      );

      expect(getSnippetText()).toBe(
        'interface SkyExampleConfig { heading: string; appearance?: SkyExampleAppearance; }',
      );
      expect(getTexts('.sky-docs-type-definition-box-heading')).toEqual([
        'heading: string',
        'appearance?: SkyExampleAppearance',
      ]);
    });

    it('should render an interface without properties', async () => {
      await render(createDefinition('interface', 'SkyExampleEmpty'));

      expect(getSnippetText()).toBe('interface SkyExampleEmpty {}');
    });

    it('should render an enumeration', async () => {
      await render(
        createDefinition<Partial<SkyManifestEnumerationDefinition>>(
          'enumeration',
          'SkyExampleSize',
          {
            children: [
              { kind: 'enum-member', name: 'Small', type: '0' },
              { kind: 'enum-member', name: 'Large', type: '1' },
            ],
          },
        ),
      );

      expect(getSnippetText()).toBe(
        'enum SkyExampleSize { Small = 0, Large = 1, }',
      );
      expect(getTexts('.sky-docs-type-definition-box-heading')).toEqual([
        'SkyExampleSize.Small',
        'SkyExampleSize.Large',
      ]);
    });

    it('should link types in a type alias', async () => {
      await render(
        createDefinition<Partial<SkyManifestTypeAliasDefinition>>(
          'type-alias',
          'SkyExampleAppearance',
          { type: "'info' | SkyExampleConfig" },
        ),
      );

      expect(getSnippetText()).toBe(
        "type SkyExampleAppearance = 'info' | SkyExampleConfig",
      );
      expect(getLinks('sky-docs-code-snippet')).toEqual([
        'SkyExampleConfig#interface_sky-example-config',
      ]);
    });
  });

  describe('type links', () => {
    it('should log an error for an unregistered SKY UX type', async () => {
      const errorSpy = spyOn(TestBed.inject(SkyLogService), 'error');

      await render(
        createDefinition('type-alias', 'SkyExampleAlias', {
          type: 'SkyExampleUnknown',
        }),
      );

      expect(errorSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('[[ SkyExampleUnknown ]]'),
      );
      expect(getLinks('sky-docs-code-snippet')).toEqual([]);
    });

    it('should update link URLs when query params change', async () => {
      const originalUrl = window.location.href;

      await render(
        createDefinition('type-alias', 'SkyExampleAlias', {
          type: 'SkyExampleConfig',
        }),
      );

      try {
        history.replaceState(null, '', '?docs-page=testing');
        queryParams.next({ 'docs-page': 'testing' });
        fixture.detectChanges();
        await fixture.whenStable();

        const link = getElement().querySelector<HTMLAnchorElement>(
          'sky-docs-code-snippet a',
        );

        expect(link?.search).toBe('?docs-page=testing');
        expect(link?.hash).toBe('#interface_sky-example-config');
      } finally {
        history.replaceState(null, '', originalUrl);
      }
    });
  });

  describe('a11y', () => {
    for (const definition of [
      createDefinition<Partial<SkyManifestFunctionDefinition>>(
        'function',
        'openSkyExample',
        {
          type: 'SkyExampleInstance',
          parameters: [
            {
              name: 'config',
              type: 'SkyExampleConfig',
              description: 'The configuration.',
            },
          ],
        },
      ),
      createDefinition('function', 'loadSkyExample', { type: 'void' }),
      createDefinition<Partial<SkyManifestDirectiveDefinition>>(
        'component',
        'SkyExampleComponent',
        {
          isPreview: true,
          selector: 'sky-example',
          children: [
            {
              kind: 'directive-input',
              name: 'heading',
              type: 'string',
              isRequired: true,
            },
            {
              kind: 'directive-input',
              name: 'closeable',
              type: 'boolean',
              defaultValue: 'false',
              isDeprecated: true,
              deprecationReason: 'Use `closeButtonVisible` instead.',
            },
            {
              kind: 'directive-output',
              name: 'closeClick',
              type: 'EventEmitter<SkyExampleConfig>',
            },
          ],
        },
      ),
      createDefinition<Partial<SkyManifestClassDefinition>>(
        'service',
        'SkyExampleService',
        {
          description: 'Opens examples.',
          children: [
            { kind: 'class-property', name: 'isOpen', type: 'boolean' },
            {
              kind: 'class-method',
              name: 'open',
              type: 'SkyExampleInstance',
              parameters: [{ name: 'config', type: 'SkyExampleConfig' }],
            },
          ],
        },
      ),
      createDefinition<Partial<SkyManifestTypeAliasDefinition>>(
        'type-alias',
        'SkyExampleAppearance',
        { type: "'info' | 'danger'" },
      ),
    ]) {
      it(`should be accessible for the ${definition.name} ${definition.kind}`, async () => {
        await render(definition);

        // The code highlight theme and type link colors don't meet contrast
        // requirements. Re-enable this rule when Code Block is migrated.
        await expectAsync(fixture.nativeElement).toBeAccessible({
          rules: { 'color-contrast': { enabled: false } },
        });
      });
    }
  });
});
