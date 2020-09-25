import {
  expect
} from '@skyux-sdk/testing';

import {
 SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Anchor link service', function () {

  let mockTypeDefinitionsProvider: SkyDocsTypeDefinitionsProvider;

  beforeEach(() => {
    mockTypeDefinitionsProvider = {
      anchorIds: {
        'foouser': 'variable-foouser', // Test lowercase type names.
        'Foo': 'foo',
        'Foo2': 'foo2',
        'FooComponent': 'foo-component',
        'FooEnum': 'foo-enum',
        'FooUser': 'foo-user'
      },
      typeDefinitions: [
        {
          name: 'FooComponent'
        },
        {
          name: 'Foo'
        },
        {
          name: 'FooUser'
        },
        {
          name: 'FooEnum'
        }
      ]
    };
  });

  it('should add anchor links and code tags to known types', () => {
    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = 'Foo FooComponent FooUser Foo2 [[Foo]] [[FooUser]] FooComponent [[Foo]] (FooUser) >Foo< FooUnknown UnknownFoo FooEnum.Foo `FooUser` <a href="#">FooUser</a>';
    const result = service.applyTypeAnchorLinks(content);

    expect(result).toEqual([
      '<code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo2">Foo2</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a></code>',
      '<code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code>',
      '(<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code>)',
      '>Foo<',
      'FooUnknown',
      'UnknownFoo',
      '<code><a class="sky-docs-anchor-link" href="#foo-enum">FooEnum</a>.Foo</code>',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code>',
      '<a href="#">FooUser</a>'
    ].join(' '));
  });

  it('should not add anchor links if codeFormat is set to false', () => {
    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = 'Foo FooComponent FooUser Foo2 [[Foo]] [[FooUser]] FooComponent [[Foo]] (FooUser) >Foo< FooUnknown UnknownFoo FooEnum.Foo `FooUser` <a href="#">FooUser</a>';
    const result = service.applyTypeAnchorLinks(content,
      {
        applyCodeFormatting: false
      }
    );

    expect(result).toEqual([
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '<a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a>',
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
      '<a class="sky-docs-anchor-link" href="#foo2">Foo2</a>',
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
      '<a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a>',
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '(<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>)',
      '>Foo<',
      'FooUnknown',
      'UnknownFoo',
      '<a class="sky-docs-anchor-link" href="#foo-enum">FooEnum</a>.Foo',
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
      '<a href="#">FooUser</a>'
    ].join(' '));
  });

  it('should handle markdown', () => {
    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = 'Accepts [foouser](https://foouser.com/).';
    const result = service.applyTypeAnchorLinks(content);
    expect(result).toEqual(content);
  });

  it('should handle undefined anchorIds', () => {
    mockTypeDefinitionsProvider = {
      anchorIds: undefined,
      typeDefinitions: mockTypeDefinitionsProvider.typeDefinitions
    };

    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = 'FooUser';
    const result = service.applyTypeAnchorLinks(content);

    expect(result).toEqual(
      content,
      'Anchor tags should not be applied if anchorIds is undefined.'
    );
  });

  it('should handle empty content', () => {
    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = '';
    const result = service.applyTypeAnchorLinks(content);

    expect(result).toEqual(
      content,
      'Anchor tags should not be applied to empty content.'
    );
  });

});
