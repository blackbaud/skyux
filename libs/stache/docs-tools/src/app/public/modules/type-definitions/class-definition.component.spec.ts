import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ClassDefinitionFixtureComponent
} from './fixtures/class-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Class definition component', function () {

  let fixture: ComponentFixture<ClassDefinitionFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeDefinitionsFixturesModule
      ],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              'FooUser': 'foo-user'
            },
            typeDefinitions: [
              {
                name: 'FooUser'
              }
            ]
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ClassDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const classDefinitionRef = fixture.componentInstance.classDefinitionRef;
    expect(classDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      description: 'This description has a FooUser.'
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-class-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within property descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      properties: [{
        description: 'This description has a FooUser.',
        name: 'foo',
        type: 'string'
      }]
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within property descriptions that have properties', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      properties: [{
        description: 'This description has a FooUser.Baz and some other things.',
        name: 'foo',
        type: 'string'
      }]
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>.Baz</code>'
    );
  }));

  it('should add links to types within method descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      methods: [{
        description: 'This description has a FooUser.',
        name: 'createFoo'
      }]
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-class-definition-method-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types for method return types', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      methods: [{
        name: 'createFoo',
        returnType: 'FooUser'
      }]
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-class-definition-return-type'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within parameter descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      methods: [{
        name: 'createFoo',
        parameters: [{
          description: 'This description has a FooUser.',
          isOptional: true,
          name: 'foo',
          type: 'string'
        }]
      }]
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

});
