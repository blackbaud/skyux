import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  PropertyDefinitionsFixtureComponent
} from './fixtures/property-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Property definitions component', function () {

  let fixture: ComponentFixture<PropertyDefinitionsFixtureComponent>;
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {
    mockMediaQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      imports: [
        TypeDefinitionsFixturesModule
      ],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              'Foo': 'foo',
              'FooUser': 'foo-user'
            },
            typeDefinitions: [
              {
                name: 'Foo'
              },
              {
                name: 'FooUser'
              }
            ]
          }
        },
        {
          provide: SkyMediaQueryService,
          useValue: mockMediaQueryService
        }
      ]
    });

    fixture = TestBed.createComponent(PropertyDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const propertyDefinitionsRef = fixture.componentInstance.propertyDefinitionsRef;
    expect(propertyDefinitionsRef.config).toEqual({});
  });

  it('should display the property\'s signature', fakeAsync(() => {
    fixture.componentInstance.config = {
      properties: [{
        isOptional: false,
        decorator: {
          name: 'Input'
        },
        name: 'foobar',
        type: {
          type: 'intrinsic',
          name: 'number'
        }
      }]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(element.textContent).toEqual('@Input()foobar: number');
  }));

  it('should add anchor links to default value', fakeAsync(() => {
    fixture.componentInstance.config = {
      properties: [{
        isOptional: true,
        decorator: {
          name: 'Input'
        },
        name: 'foobar',
        type: {
          type: 'reference',
          name: 'FooUser'
        },
        defaultValue: 'new FooUser()'
      }]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definition-label-optional'
    );

    expect(element.innerHTML).toContain(
      'new <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>()'
    );
  }));

  it('should add links and code tags to types within deprecation messages', fakeAsync(() => {
    fixture.componentInstance.config = {
      properties: [{
        isOptional: true,
        decorator: {
          name: 'Input'
        },
        deprecationWarning: 'Use Foo from FooUser instead, because Foo is now supported.',
        name: 'foobar',
        type: {
          type: 'intrinsic',
          name: 'number'
        }
      }]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-deprecation-warning'
    );

    expect(element.innerHTML).toContain([
      'Use <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> from',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code> instead,',
      'because <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> is now supported.'
    ].join(' '));
  }));

  it('should add links to types within descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      properties: [{
        isOptional: true,
        decorator: {
          name: 'Input'
        },
        description: 'Use Foo from FooUser instead, because Foo is now supported.',
        name: 'foobar',
        type: {
          type: 'intrinsic',
          name: 'number'
        }
      }]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-description'
    );

    expect(element.innerHTML).toContain([
      'Use <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> from',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code> instead,',
      'because <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> is now supported.'
    ].join(' '));
  }));

  it('should add links around property types', fakeAsync(() => {
    fixture.componentInstance.config = {
      properties: [{
        isOptional: true,
        name: 'foobar',
        type: {
          type: 'reference',
          name: 'Foo'
        }
      }]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>'
    );
  }));

});
