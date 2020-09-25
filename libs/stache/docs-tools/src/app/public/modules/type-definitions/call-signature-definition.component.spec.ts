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
  CallSignatureDefinitionFixtureComponent
} from './fixtures/call-signature-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Call signature definition', () => {

  let fixture: ComponentFixture<CallSignatureDefinitionFixtureComponent>;

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

    fixture = TestBed.createComponent(CallSignatureDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.callSignatureDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types for method return types', fakeAsync(() => {
    fixture.componentInstance.config = {
      parameters: [],
      returnType: {
        type: 'reference',
        name: 'FooUser'
      }
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-call-signature-definition-return-type'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within parameter descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      parameters: [{
        description: 'The FooUser to save.',
        name: 'saveUser',
        isOptional: true,
        type: {
          type: 'reference',
          name: 'FooUser'
        }
      }],
      returnType: {
        type: 'intrinsic',
        name: 'void'
      }
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-description'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

});
