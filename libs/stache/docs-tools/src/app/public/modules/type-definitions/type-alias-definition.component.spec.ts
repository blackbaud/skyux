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
  TypeAliasDefinitionFixtureComponent
} from './fixtures/type-alias-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Type alias definition component', function () {

  let fixture: ComponentFixture<TypeAliasDefinitionFixtureComponent>;

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

    fixture = TestBed.createComponent(TypeAliasDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const typeAliasDefinitionRef = fixture.componentInstance.typeAliasDefinitionRef;
    expect(typeAliasDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'Foo',
      description: 'This description has a FooUser.',
      types: ['string', 'number']
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-type-alias-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types around return type', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'Foo',
      returnType: 'FooUser'
    };

    fixture.detectChanges();
    tick();

    const returnValueElement = fixture.nativeElement.querySelector(
      '.sky-docs-type-alias-definition-return-type'
    );

    expect(returnValueElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types for parameters', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'Foo',
      returnType: 'void',
      parameters: [{
        description: 'This description has a FooUser.',
        isOptional: false,
        name: 'user',
        type: 'string'
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
