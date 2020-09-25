import {
  expect
} from '@skyux-sdk/testing';

import {
  MockTypeDocAdapterService
} from './fixtures/mock-type-definitions.service';

import {
  SkyDocsTypeDefinitions
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

import {
  SkyDocsTypeDocAdapterService
} from './typedoc-adapter.service';

describe('Type definitions service', function () {

  //#region helpers

  function getService(provider: SkyDocsTypeDefinitionsProvider = {
    anchorIds: {},
    typeDefinitions: [
      {
        anchorId: '',
        decorators: [{ name: 'Component', type: {} }],
        name: 'FooComponent',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.component.ts' }]
      },
      {
        anchorId: '',
        decorators: [{ name: 'Directive', type: {} }],
        name: 'FooDirective',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.directive.ts' }]
      },
      {
        anchorId: '',
        decorators: [{ name: 'Injectable', type: {} }],
        name: 'FooService',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.service.ts' }]
      },
      {
        anchorId: '',
        decorators: [{ name: 'NgModule', type: {} }],
        name: 'FooModule',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.module.ts' }]
      },
      {
        anchorId: '',
        decorators: [{ name: 'Pipe', type: {} }],
        name: 'FooPipe',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.pipe.ts' }]
      },
      {
        anchorId: '',
        name: 'FooClass',
        kindString: 'Class',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo-class.ts' }]
      },
      {
        anchorId: '',
        name: 'Foo',
        kindString: 'Interface',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo.ts' }]
      },
      {
        anchorId: '',
        name: 'FooEnum',
        kindString: 'Enumeration',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo-enum.ts' }]
      },
      {
        anchorId: '',
        name: 'TypeAlias',
        kindString: 'Type alias',
        sources: [{ fileName: 'src/app/public/modules/_documentation-test/foo-alias.ts' }]
      }
    ]
  }): SkyDocsTypeDefinitionsService {
    const adapter = new MockTypeDocAdapterService();
    return new SkyDocsTypeDefinitionsService(provider, adapter as SkyDocsTypeDocAdapterService);
  }

  //#endregion

  it('should return type definitions from a specific source code path', () => {
    const service = getService();
    const result = service.getTypeDefinitions('/src/app/public/modules/_documentation-test/');

    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        const lookup = key as keyof SkyDocsTypeDefinitions;
        expect(result[lookup].length).toEqual(1, 'The result is expected to have one item in each category.');
      }
    }
  });

  it('should return empty type arrays if the path does not include types', () => {
    const service = getService({
      anchorIds: {},
      typeDefinitions: undefined
    });
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
    const spy = spyOn(console, 'warn');
    const service = getService({
      anchorIds: {},
      typeDefinitions: []
    });
    service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(spy).toHaveBeenCalledWith('Type definitions were not found for location: modules/empty/');
  });

  it('should throw an error if the source code path does not end in a slash', () => {
    const service = getService();
    expect(function () {
      service.getTypeDefinitions('/src/app/public/modules/foobar');
    }).toThrow(
      new Error('The source code path must end with a forward slash (`/`).')
    );
  });

});
